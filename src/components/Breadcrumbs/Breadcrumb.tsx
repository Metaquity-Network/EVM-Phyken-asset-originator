import Link from 'next/link';
interface BreadcrumbProps {
  pageName: string[];
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">{pageName.slice(-1)}</h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          {pageName.map((name: string, index: number) =>
            index !== pageName.length - 1 ? (
              <Link key={index} className="font-medium" href={`/${name.toLocaleLowerCase().replaceAll(' ', '-')}`}>
                {name} /
              </Link>
            ) : (
              <div key={index} className="text-primary">
                {name}
              </div>
            ),
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
