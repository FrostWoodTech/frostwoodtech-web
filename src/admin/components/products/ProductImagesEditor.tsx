import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useAddProductImage,
  useDeleteProductImage,
  useReorderProductImages,
  useUpdateProductImage,
} from "@/admin/hooks/useProducts";
import {
  createPresignedUpload,
  uploadToPresignedUrl,
} from "@/admin/services/mediaService";
import { toErrorMessage } from "@/admin/api/ApiError";
import { altTextFromFileName } from "@/admin/utils/markdownImages";
import { productKeys } from "@/admin/hooks/queryKeys";
import useToast from "@/admin/context/useToast";
import type { AdminProduct, ProductImage } from "@/admin/types";
import { Button, Input, Modal } from "@/admin/components/ui";
import SortableProductImageRow from "@/admin/components/products/SortableProductImageRow";

interface ProductImagesEditorProps {
  readonly productId: string;
  readonly productSlug: string;
  readonly images: readonly ProductImage[];
}

/** Reads pixel dimensions from the file; the upload response has none. */
function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions."));
    };
    image.src = objectUrl;
  });
}

/** Images have their own endpoints, so changes hit the API directly rather than waiting for the form's Save. */
export default function ProductImagesEditor({
  productId,
  productSlug,
  images,
}: ProductImagesEditorProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Old and new primary change in one request, so both rows are frozen while it runs.
  const [primaryUpdateIds, setPrimaryUpdateIds] = useState<readonly string[]>(
    [],
  );
  const [editingAltText, setEditingAltText] = useState<ProductImage | null>(
    null,
  );
  const [altTextDraft, setAltTextDraft] = useState("");

  const addImageMutation = useAddProductImage();
  const updateImageMutation = useUpdateProductImage();
  const deleteImageMutation = useDeleteProductImage();
  const reorderImagesMutation = useReorderProductImages();

  // Local copy so a drop reorders synchronously; reading the cache lands a render late and flickers.
  const [rows, setRows] = useState(() =>
    [...images].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  useEffect(() => {
    setRows([...images].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [images]);

  const primary = rows.find((image) => image.isPrimary) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  async function handleFileChosen(file: File) {
    const altText = altTextFromFileName(file.name);
    if (!altText) {
      toast.error("An image needs alt text before it can be uploaded.");
      return;
    }
    if (
      rows.some((row) => row.altText.toLowerCase() === altText.toLowerCase())
    ) {
      toast.error(`An image named "${altText}" is already in this gallery.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const [presigned, dimensions] = await Promise.all([
        createPresignedUpload({ target: "products", slug: productSlug }),
        readImageDimensions(file),
      ]);
      await uploadToPresignedUrl(presigned.uploadUrl, file, setUploadProgress);

      await addImageMutation.mutateAsync({
        productId,
        body: {
          objectKey: presigned.objectKey,
          url: presigned.publicUrl,
          altText,
          width: dimensions.width,
          height: dimensions.height,
          isPrimary: rows.length === 0,
          sortOrder: rows.length,
        },
      });
      toast.success("Image uploaded.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function openAltTextEditor(image: ProductImage) {
    setEditingAltText(image);
    setAltTextDraft(image.altText);
  }

  async function saveAltText() {
    if (!editingAltText) return;
    const next = altTextDraft.trim();
    if (!next || next === editingAltText.altText) {
      setEditingAltText(null);
      return;
    }

    setBusyId(editingAltText.id);
    try {
      await updateImageMutation.mutateAsync({
        productId,
        imageId: editingAltText.id,
        body: {
          objectKey: editingAltText.objectKey,
          url: editingAltText.url,
          altText: next,
          width: editingAltText.width,
          height: editingAltText.height,
          isPrimary: editingAltText.isPrimary,
          sortOrder: editingAltText.sortOrder,
        },
      });
      toast.success("Alt text updated.");
      setEditingAltText(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  async function handleMakePrimary(image: ProductImage) {
    if (image.isPrimary) return;

    const outgoingId = primary?.id;
    setPrimaryUpdateIds(outgoingId ? [outgoingId, image.id] : [image.id]);
    const loadingToastId = toast.loading("Updating primary image…");
    try {
      await updateImageMutation.mutateAsync({
        productId,
        imageId: image.id,
        body: {
          objectKey: image.objectKey,
          url: image.url,
          altText: image.altText,
          width: image.width,
          height: image.height,
          isPrimary: true,
          sortOrder: image.sortOrder,
        },
      });
      toast.success("Primary image updated.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      toast.dismiss(loadingToastId);
      setPrimaryUpdateIds([]);
    }
  }

  async function handleDelete(image: ProductImage) {
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) return;

    setBusyId(image.id);
    try {
      await deleteImageMutation.mutateAsync({ productId, imageId: image.id });
      toast.success("Image deleted.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  }

  /** Reorders locally and in the cache; rolls both back on failure. */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((image) => image.id === active.id);
    const toIndex = rows.findIndex((image) => image.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const previousRows = rows;
    const reordered = arrayMove([...rows], fromIndex, toIndex).map(
      (image, at) => ({ ...image, sortOrder: at }),
    );
    setRows(reordered);

    const queryKey = productKeys.detail(productId);
    const previousCache = queryClient.getQueryData<AdminProduct>(queryKey);
    queryClient.setQueryData<AdminProduct | undefined>(
      queryKey,
      (old) => old && { ...old, images: reordered },
    );

    try {
      await reorderImagesMutation.mutateAsync({
        productId,
        body: {
          items: reordered.map((image) => ({
            id: image.id,
            sortOrder: image.sortOrder,
          })),
        },
      });
      toast.success("Order updated.");
    } catch (cause) {
      setRows(previousRows);
      queryClient.setQueryData(queryKey, previousCache);
      toast.error(toErrorMessage(cause));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={isUploading}
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload className="h-4 w-4" />}
          iconPosition="left"
        >
          {isUploading ? "Uploading…" : "Upload image"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFileChosen(file);
          }}
        />

        {isUploading && (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-800">
            <div
              className="h-full rounded-full bg-primary-500 transition-[width] duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">No images yet.</p>
      ) : (
        <ul className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows.map((image) => image.id)}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((image) => (
                <SortableProductImageRow
                  key={image.id}
                  image={image}
                  busy={
                    busyId === image.id || primaryUpdateIds.includes(image.id)
                  }
                  onEditAltText={openAltTextEditor}
                  onMakePrimary={handleMakePrimary}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      )}

      <p className="flex items-center gap-2 text-xs text-text-muted">
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Images upload straight to Neon Object Storage; the API only stores their
        metadata.
      </p>

      <Modal
        open={editingAltText !== null}
        onClose={() => setEditingAltText(null)}
        title="Edit alt text"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingAltText(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={saveAltText}
              loading={
                busyId === editingAltText?.id && updateImageMutation.isPending
              }
              disabled={
                !altTextDraft.trim() ||
                altTextDraft.trim() === editingAltText?.altText
              }
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          label="Alt text"
          value={altTextDraft}
          onChange={(event) => setAltTextDraft(event.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
}
