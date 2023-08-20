import React from 'react';
import iconsJson from '../../../dist/icons.json';
import tagsJson from '../../../src/tags.json';
import clsx from 'clsx';
import { version } from '../../../package.json';

type StrokeLincap = 'round' | 'square' | 'butt';
type StrokeLinejoin = 'round' | 'bevel' | 'miter';

const icons = Object.entries(iconsJson)
  .map(([name, svg]) => {
    const tags: Array<string> = tagsJson[name] || [];
    return { name, svg, tags };
  })
  .reduce((acc, icon) => {
    acc[icon.name] = icon;
    return acc;
  }, {} as Record<string, { name: string; svg: string; tags: Array<string> }>);

export function App() {
  const [query, setQuery] = useSearchParam('query', '');
  const [selectedIcon, setSelectedIcon] = useSearchParam('icon', '');
  const [size, setSize] = useSearchParam('size', '24');
  const [strokeWidth, setStrokeWidth] = useSearchParam('stroke_width', '2');
  const [strokeLinecap, setStrokeLinecap] = useSearchParam(
    'stroke_linecap',
    'round',
  );
  const [strokeLinejoin, setStrokeLinejoin] = useSearchParam(
    'stroke_linejoin',
    'round',
  );
  const [color, setColor] = useSearchParam('color', 'currentColor');
  const deferredQuery = React.useDeferredValue(query);

  const results = React.useMemo(() => {
    if (!deferredQuery) {
      return Object.values(icons);
    }

    return Object.values(icons).filter(name => {
      return (
        name.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        name.tags.some(tag =>
          tag.toLowerCase().includes(deferredQuery.toLowerCase()),
        )
      );
    });
  }, [deferredQuery]);

  // Focus the search input when the user presses the `/` key
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!searchRef.current) return;

      if (event.key === '/') {
        event.preventDefault();
        searchRef.current.focus();
      }
    }

    console.log('adding event listener');

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div
      className="h-screen [@supports(height:100svh)]:h-[100svh] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] overflow-hidden grid grid-cols-[20rem_1fr_24rem]"
      style={{
        // @ts-ignore
        '--size': `${size}px`,
        '--stroke-width': `${strokeWidth}px`,
        '--stroke-linecap': strokeLinecap,
        '--stroke-linejoin': strokeLinejoin,
        '--color': color,
      }}
    >
      <div className="border-r border-border flex flex-col justify-between">
        <div className="flex flex-col gap-6 p-4 pt-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-semibold inline-block">Feather</h1>
                <span className="text-text-secondary text-sm ml-1">
                  v{version}
                </span>
              </div>
              <IconButton>
                <Icon
                  name="sidebar"
                  size="24px"
                  color="var(--color-text-secondary)"
                />
              </IconButton>
            </div>
            <p>
              Beautifully simple open-source icons designed on a 24×24 grid.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="bg-bg-secondary font-semibold w-full py-2 text-center rounded block"
            >
              Get started
            </a>
            <a
              href="#"
              className="bg-bg-secondary font-semibold w-full py-2 text-center rounded block"
            >
              Download all
            </a>
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <a
              href="#"
              className="py-2 px-4 hover:bg-bg-secondary flex justify-between items-center"
            >
              Request an icon
              <Icon
                name="arrow-up-right"
                size="24px"
                color="var(--color-text-secondary)"
              />
            </a>
            <a
              href="#"
              className="py-2 px-4 hover:bg-bg-secondary flex justify-between items-center"
            >
              Donate on PayPal
              <Icon
                name="arrow-up-right"
                size="24px"
                color="var(--color-text-secondary)"
              />
            </a>
            <a
              href="#"
              className="py-2 px-4 hover:bg-bg-secondary flex justify-between items-center"
            >
              GitHub
              <Icon
                name="arrow-up-right"
                size="24px"
                color="var(--color-text-secondary)"
              />
            </a>
          </div>
          <div className="p-4">
            <div className="w-full h-[160px] bg-bg-secondary"></div>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <input
          ref={searchRef}
          className="w-full bg-bg px-4 h-14 border-b border-border sticky top-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-border-focus [&::-webkit-search-cancel-button]:appearance-none"
          type="search"
          placeholder={`Search ${Object.keys(icons).length} icons...`}
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <ul
          className="grid"
          style={{
            gridTemplateColumns: `repeat(auto-fill,minmax(${
              parseInt(size) * 3
            }px,1fr))`,
          }}
        >
          {results.map(icon => {
            return (
              <li className="w-full aspect-square ">
                {/* TODO: Use arrow keys to move focus between icons */}
                <button
                  className={clsx(
                    'w-full h-full grid place-items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-border-focus',
                    icon.name !== selectedIcon && 'hover:bg-bg-secondary',
                    icon.name === selectedIcon && 'bg-bg-tertiary',
                  )}
                  onClick={() => setSelectedIcon(icon.name)}
                >
                  <Icon name={icon.name} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-l border-border flex flex-col divide-y divide-border overflow-auto">
        {selectedIcon ? (
          <>
            <div className="flex flex-col gap-2 p-4 pt-2 items-center">
              <div className="w-full flex justify-between items-center">
                <h2 className="font-semibold text-xl">{selectedIcon}</h2>
                <div className="flex">
                  <IconButton>
                    <Icon name="link" size="24px" color="currentColor" />
                  </IconButton>
                </div>
              </div>
              <div className="relative max-w-[160px] w-full aspect-square px-grid ring-1 ring-inset ring-border">
                <Icon name={selectedIcon} size="100%" />
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">SVG</span>
                <div className="flex">
                  <IconButton>
                    <Icon name="copy" size="24px" color="currentColor" />
                  </IconButton>
                  <IconButton>
                    <Icon name="download" size="24px" color="currentColor" />
                  </IconButton>
                </div>
              </div>
              <pre className="overflow-auto bg-bg-secondary text-sm p-4 rounded">
                {`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="${strokeLinecap}" stroke-linejoin="round">
  ${icons[selectedIcon].svg}
</svg>`}
              </pre>
            </div>
            <div
              className={clsx(
                'flex flex-col gap-2 p-4 pt-2',
                icons[selectedIcon].tags.length === 0 && 'pb-2',
              )}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">Tags</span>
                <div className="flex">
                  <IconButton>
                    <Icon name="plus" size="24px" color="currentColor" />
                  </IconButton>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2 empty:hidden">
                {icons[selectedIcon].tags.map(tag => (
                  <li key={tag}>
                    <button
                      className="inline-block bg-bg-secondary leading-5 px-2 py-1 rounded hover:bg-bg-tertiary"
                      onClick={() => setQuery(tag)}
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
        <div className="flex divide-x divide-border">
          <div className="flex flex-col gap-2 pt-2 p-4 w-full">
            <div className="h-10 flex items-center justify-between">
              <label htmlFor="size" className="font-semibold">
                Size
              </label>
              <span>{size}px</span>
            </div>
            <input
              id="size"
              type="range"
              min="12"
              max="100"
              step="4"
              value={size}
              onChange={event => setSize(event.target.value)}
              list="sizes"
            />
            <datalist id="sizes">
              <option value="24" />
            </datalist>
          </div>
          <div className="flex flex-col gap-2 pt-2 p-4 w-full">
            <div className="h-10 flex items-center justify-between">
              <label htmlFor="stroke-width" className="font-semibold">
                Stroke width
              </label>
              <span>{strokeWidth}px</span>
            </div>
            <input
              id="stroke-width"
              type="range"
              min="1"
              max="3"
              step="0.5"
              value={strokeWidth}
              onChange={event => setStrokeWidth(event.target.value)}
              list="stroke-widths"
            />
            <datalist id="stroke-widths">
              <option value="2" />
            </datalist>
          </div>
        </div>
        <div className="flex divide-x divide-border">
          <div className="flex flex-col gap-2 pt-2 p-4 w-full">
            <div className="h-10 flex items-center justify-between">
              <label htmlFor="stroke-linecap" className="font-semibold">
                Stroke linecap
              </label>
            </div>
            <select
              id="stroke-linecap"
              className="p-2 bg-bg-secondary rounded w-full"
              value={strokeLinecap}
              onChange={event => setStrokeLinecap(event.target.value)}
            >
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="butt">Butt</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 pt-2 p-4 w-full">
            <div className="h-10 flex items-center justify-between">
              <label htmlFor="stroke-linejoin" className="font-semibold">
                Stroke linejoin
              </label>
            </div>
            <select
              id="stroke-linejoin"
              className="p-2 bg-bg-secondary rounded w-full"
              value={strokeLinejoin}
              onChange={event => setStrokeLinejoin(event.target.value)}
            >
              <option value="round">Round</option>
              <option value="bevel">Bevel</option>
              <option value="miter">Miter</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2 p-4">
          <div className="h-10 flex items-center justify-between">
            <label htmlFor="color" className="font-semibold">
              Color
            </label>
          </div>
          <div className="relative">
            <div className="absolute left-2 top-2 bottom-2 h-6 w-6 bg-[var(--color,currentColor)] rounded-full inline-block"></div>
            <input
              id="color"
              type="text"
              className="py-2 pl-10 px-3 bg-transparent ring-1 ring-inset ring-border rounded w-full"
              value={color}
              onChange={event => setColor(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2 p-4">
          <div className="h-10 flex items-center justify-between">
            <label htmlFor="color" className="font-semibold">
              Background color
            </label>
            <IconButton>
              <Icon name="plus" size="24px" color="currentColor" />
            </IconButton>
          </div>
          {/* <div className="relative">
            <div className="absolute left-2 top-2 bottom-2 h-6 w-6 bg-[var(--color,currentColor)] rounded-full inline-block"></div>
            <input
              id="color"
              type="text"
              className="py-2 pl-10 px-3 bg-transparent ring-1 ring-inset ring-border rounded w-full"
              value={color}
              onChange={event => setColor(event.target.value)}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

function Icon({
  name,
  size,
  color,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  name: string;
  size?: string;
  color?: string;
}) {
  if (!icons[name]) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      dangerouslySetInnerHTML={{ __html: icons[name].svg }}
      {...props}
      className={clsx(
        'w-[var(--size,24px)] h-[var(--size,24px)] [stroke-width:var(--stroke-width,2px)] [stroke-linecap:var(--stroke-linecap,round)] [stroke-linejoin:var(--stroke-linejoin,round)] stroke-[var(--color,currentColor)]',
        props.className,
      )}
      style={{
        // @ts-ignore
        '--size': size,
        '--color': color,
        ...props.style,
      }}
    />
  );
}

function IconButton(props: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      className={clsx(
        'p-2 hover:bg-bg-secondary rounded text-text-secondary',
        props.className,
      )}
    />
  );
}

function useSearchParam(
  key: string,
  defaultValue: string,
): [string, React.Dispatch<string>] {
  const [value, setValue] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return (
        new URLSearchParams(window.location.search).get(key) || defaultValue
      );
    }

    return defaultValue;
  });

  // Sync the value to the URL
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }

      window.history.replaceState({}, '', url.toString());
    }
  }, [value]);

  return [value, setValue];
}