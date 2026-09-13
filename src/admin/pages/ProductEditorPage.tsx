import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductImagesEditor from "@/admin/components/products/ProductImagesEditor";
import { usePersistedForm } from "@/shared/hooks/usePersistedForm";
import {
  useCreateProduct,
  useProduct,
  useUpdateProduct,
} from "@/admin/hooks/useProducts";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { slugify } from "@/admin/utils/format";
import type { AdminProduct, ProductWriteRequest } from "@/admin/types";
import {
  productSchema,
  type ProductFormValues,
} from "@/admin/validation/productSchemas";
import {
  Alert,
  BackLink,
  Button,
  Checkbox,
  Input,
  MarkdownField,
  PageHeader,
  Spinner,
  Textarea,
} from "@/admin/components/ui";

type TabId = "details" | "gallery" | "visibility";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "visibility", label: "Visibility & SEO" },
];

/** Fields per tab, used only to show an error dot on a tab. */
const TAB_FIELDS: Record<TabId, readonly (keyof ProductFormValues)[]> = {
  details: [
    "name",
    "slug",
    "tagline",
    "description",
    "priceDetails",
    "productUrl",
  ],
  gallery: [],
  visibility: ["isPublished", "seoTitle", "seoDescription"],
};

const TAB_BASE =
  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer";

function blankValues(): ProductFormValues {
  return {
    name: "",
    slug: "",
    tagline: "",
    description: "",
    priceDetails: "",
    productUrl: "",
    isPublished: false,
    seoTitle: "",
    seoDescription: "",
    showOnAgency: false,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
  };
}

/** Absent optional strings become `""`. */
function toFormValues(product: AdminProduct | null): ProductFormValues {
  if (!product) return blankValues();

  return {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    priceDetails: product.priceDetails ?? "",
    productUrl: product.productUrl ?? "",
    isPublished: product.isPublished,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    showOnAgency: product.showOnAgency,
    featuredOnAgency: product.featuredOnAgency,
    showOnPersonal: product.showOnPersonal,
    featuredOnPersonal: product.featuredOnPersonal,
  };
}

/** Untouched optional fields are `""`; the API wants them omitted. */
function blank(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Serves both `/admin/products/new` and `/admin/products/:id`. */
export default function ProductEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // After a create, navigation state opens the Gallery tab.
  const location = useLocation();
  const initialTab = (location.state as { openTab?: TabId } | null)?.openTab;

  const {
    data: product,
    isPending: isLoading,
    error: queryError,
  } = useProduct(id);
  const loadError = queryError ? toErrorMessage(queryError) : null;

  if (id && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-primary-400">
        <Spinner className="h-6 w-6" label="Loading product" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <Alert className="mb-6">{loadError}</Alert>
        <Button href="/admin/products" variant="outline" size="sm">
          Back to products
        </Button>
      </div>
    );
  }

  // Keyed so switching products remounts the form with fresh defaults.
  return (
    <ProductForm
      key={product?.id ?? "new"}
      product={product ?? null}
      initialTab={product ? initialTab : undefined}
      onDone={() => navigate("/admin/products")}
    />
  );
}

interface ProductFormProps {
  /** `null` means create mode. */
  readonly product: AdminProduct | null;
  readonly initialTab?: TabId;
  readonly onDone: () => void;
}

function ProductForm({ product, initialTab, onDone }: ProductFormProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>(initialTab ?? "details");
  const toast = useToast();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const isSaving =
    createProductMutation.isPending || updateProductMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    clearPersisted,
    formState: { errors, isSubmitting },
  } = usePersistedForm<ProductFormValues>(
    `product-form:${product?.id ?? "new"}`,
    {
      resolver: zodResolver(productSchema),
      defaultValues: toFormValues(product),
    },
  );

  const name = useWatch({ control, name: "name" });

  const tabsWithErrors = useMemo(() => {
    const flagged = new Set<TabId>();
    for (const { id } of TABS) {
      if (TAB_FIELDS[id].some((field) => errors[field])) flagged.add(id);
    }
    return flagged;
  }, [errors]);

  async function onSubmit(values: ProductFormValues) {
    // Built explicitly: PUT replaces the whole record, so no field may be omitted.
    const body: ProductWriteRequest = {
      name: values.name.trim(),
      slug: blank(values.slug),
      tagline: values.tagline.trim(),
      description: values.description.trim(),
      priceDetails: blank(values.priceDetails),
      productUrl: blank(values.productUrl),
      isPublished: values.isPublished,
      seoTitle: blank(values.seoTitle),
      seoDescription: blank(values.seoDescription),
      // Edited on the reorder screen; carried through unchanged.
      showOnAgency: values.showOnAgency,
      featuredOnAgency: values.featuredOnAgency,
      showOnPersonal: values.showOnPersonal,
      featuredOnPersonal: values.featuredOnPersonal,
    };

    try {
      if (product) {
        await updateProductMutation.mutateAsync({ id: product.id, body });
        toast.success("Product updated.");
        clearPersisted();
        onDone();
      } else {
        const created = await createProductMutation.mutateAsync(body);
        toast.success("Product created — add gallery images below.");
        clearPersisted();
        // Images need an id, so go straight to the Gallery tab.
        navigate(`/admin/products/${created.id}`, {
          state: { openTab: "gallery" },
        });
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === "slug_taken") {
        setTab("details");
        setError("slug", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  const slugPreview = slugify(name ?? "");

  return (
    <div className="max-w-3xl">
      <BackLink to="/admin/products">Products</BackLink>

      <PageHeader
        title={product ? "Edit product" : "New product"}
        description={
          product
            ? "Every field is sent on save — the API replaces the whole product."
            : "A short pitch and a markdown write-up. Pricing copy is markdown too — there's no structured amount."
        }
      />

      {/* Panels are hidden, not unmounted, so errors on other tabs still block submit. */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          role="tablist"
          aria-label="Product sections"
          className="flex items-center gap-1 mb-6 border-b border-border-subtle pb-3"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`${TAB_BASE} ${
                tab === id
                  ? "bg-primary-600/10 text-primary-400"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-800"
              }`}
            >
              {label}
              {tabsWithErrors.has(id) && (
                <span
                  aria-label="has errors"
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-danger-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className={tab === "details" ? "space-y-5" : "hidden"}>
          <Input
            label="Name"
            required
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="flex gap-4">
            <Input
              label="Slug"
              placeholder={slugPreview || "generated-from-the-name"}
              containerClassName="flex-1"
              error={errors.slug?.message}
              {...register("slug")}
            />

            <Input
              label="Product URL"
              placeholder="https://example.com"
              containerClassName="flex-1"
              error={errors.productUrl?.message}
              {...register("productUrl")}
            />
          </div>

          <Textarea
            label="Tagline"
            required
            rows={2}
            hint="A one-line pitch shown under the name."
            error={errors.tagline?.message}
            {...register("tagline")}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <MarkdownField
                label="Description"
                required
                height={320}
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="priceDetails"
            render={({ field }) => (
              <MarkdownField
                label="Price details"
                height={180}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.priceDetails?.message}
              />
            )}
          />
        </div>

        <div className={tab === "gallery" ? "space-y-5" : "hidden"}>
          {product ? (
            <ProductImagesEditor
              productId={product.id}
              productSlug={product.slug}
              images={product.images}
            />
          ) : (
            <p className="text-sm text-text-muted">
              Save the product first — images hang off a saved product.
            </p>
          )}
        </div>

        <div className={tab === "visibility" ? "space-y-5" : "hidden"}>
          <Checkbox
            label="Published"
            hint="Drafts stay off both public sites. Once published, use Reorder & Visibility to show it on a site."
            {...register("isPublished")}
          />

          <Input
            label="SEO title"
            placeholder="Falls back to the product name"
            error={errors.seoTitle?.message}
            {...register("seoTitle")}
          />

          <Textarea
            label="SEO description"
            rows={3}
            placeholder="Falls back to the tagline"
            error={errors.seoDescription?.message}
            {...register("seoDescription")}
          />
        </div>

        <div className="sticky bottom-0 mt-6 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-surface-950/90 backdrop-blur border-t border-border-subtle">
          {tabsWithErrors.size > 0 && (
            <p className="mb-4 text-xs text-danger-400">
              Some fields need attention — the dotted tabs above have errors.
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset(toFormValues(product));
                clearPersisted();
              }}
              disabled={isSubmitting || isSaving}
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDone}
              disabled={isSubmitting || isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isSubmitting || isSaving}>
              {isSubmitting || isSaving
                ? "Saving…"
                : product
                  ? "Save changes"
                  : "Create product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
