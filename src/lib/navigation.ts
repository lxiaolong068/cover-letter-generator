export const dashboardNavigation = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/generate', label: 'Generate Cover Letter' },
  { href: '/dashboard/templates', label: 'My Templates' },
  { href: '/dashboard/history', label: 'History' },
];

export const createBreadcrumbs = (currentPath: string) => {
  const breadcrumbs: Array<{ href?: string; label: string }> = [{ href: '/', label: 'Home' }];

  if (currentPath === '/dashboard') {
    breadcrumbs.push({ label: 'Dashboard' });
  } else if (currentPath === '/dashboard/generate') {
    breadcrumbs.push({ href: '/dashboard', label: 'Dashboard' });
    breadcrumbs.push({ label: 'Generate Cover Letter' });
  } else if (currentPath === '/dashboard/templates') {
    breadcrumbs.push({ href: '/dashboard', label: 'Dashboard' });
    breadcrumbs.push({ label: 'My Templates' });
  } else if (currentPath === '/dashboard/history') {
    breadcrumbs.push({ href: '/dashboard', label: 'Dashboard' });
    breadcrumbs.push({ label: 'History' });
  }

  return breadcrumbs;
};
