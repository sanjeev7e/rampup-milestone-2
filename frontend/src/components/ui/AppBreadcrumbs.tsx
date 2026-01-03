import { Link, useLocation } from "react-router-dom";

export default function AppBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    products: "Product List",
    add: "Add Products",
    orders: "Orders",
    vendors: "Vendors",
    settings: "Settings",
    edit: "Edit Product",
    view: "View Product",
  };

  const breadcrumbs: { label: string; to: string; isLink: boolean }[] = [];

  let currentPath = "";
  pathnames.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (segment === "admin") return;

    const prev = pathnames[index - 1];
    // Skip if previous segment was edit or view (skips the ID)
    if (prev === "edit" || prev === "view") return;

    const label = breadcrumbNameMap[segment] || segment;
    // Don't make "edit" or "view" intermediate segments links usually,
    // but here they are likely the last one or close to it.
    // If we are at /admin/products/edit/123, "edit" is the segment.
    // We want "Product List" -> "Edit Product".
    // "Product List" is link. "Edit Product" is active.

    breadcrumbs.push({
      label,
      to: currentPath,
      isLink: true,
    });
  });

  // The last breadcrumb is always the current page, so it shouldn't be a link.
  if (breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].isLink = false;
  }

  return (
    <div className='flex items-center gap-2 text-sm font-normal'>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={crumb.to} className='flex items-center gap-2'>
            {index > 0 && <span className='text-gray-400'>•</span>}
            {crumb.isLink ? (
              <Link to={crumb.to} className='hover:underline text-text-color'>
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary" : "text-text-color"}>
                {crumb.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
