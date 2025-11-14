import React, { useMemo, useState } from "react";

/**
 * CTS – Custom Truck Service F250 Customizer
 * -------------------------------------------------
 * Transparent PNGs should live in /public/imgs/f250.
 * The logo file /public/cts-logo.png is used in the header.
 */

const ASSET_MAP = {
  base: {
    top: "/imgs/f250/base_top.png",
    driver: "/imgs/f250/base_driver.png",
    passenger: "/imgs/f250/base_passenger.png",
    front: "/imgs/f250/base_front.png",
    rear: "/imgs/f250/base_rear.png",
  },
  workbox: {
    top: "/imgs/f250/workbox_top.png",
    driver: "/imgs/f250/workbox_driver.png",
    passenger: "/imgs/f250/workbox_passenger.png",
    front: "/imgs/f250/workbox_front.png",
    rear: "/imgs/f250/workbox_rear.png",
  },
};

const VIEW_ORDER = ["top", "driver", "passenger", "front", "rear"];
const VIEW_LABEL = {
  top: "Top",
  driver: "Driver Side",
  passenger: "Passenger Side",
  front: "Front",
  rear: "Rear",
};

const ACCESSORY_LABELS = {
  workbox: "Workbox Bed",
  slide_vise: "Slide Vise",
  fire_extinguisher: "Fire Extinguisher",
  toolbox: "Toolbox",
  grill_guard: "Grill Guard",
};

export default function CTSCustomizer() {
  const [view, setView] = useState("driver");
  const [accessories, setAccessories] = useState({
    workbox: false,
    slide_vise: false,
    fire_extinguisher: false,
    toolbox: false,
    grill_guard: false,
  });

  const activePack = accessories.workbox ? "workbox" : "base";
  const currentImage = useMemo(() => ASSET_MAP[activePack][view], [activePack, view]);

  const toggleAccessory = (key) =>
    setAccessories((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen w-full bg-neutral-100 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/cts-logo.png"
              alt="CTS Logo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // graceful fallback to text if image missing
                e.target.outerHTML =
                  '<span class="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center font-bold">CTS</span>';
              }}
            />
            <div>
              <h1 className="text-xl font-semibold leading-none">Truck Customizer</h1>
              <p className="text-xs text-neutral-500">
                Switch views • Toggle accessories
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Canvas */}
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 flex flex-col">
          <div className="flex flex-wrap gap-2">
            {VIEW_ORDER.map((k) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={
                  "px-3 py-2 rounded-xl text-sm border transition shadow-sm " +
                  (view === k
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-neutral-50 border-neutral-300")
                }
              >
                {VIEW_LABEL[k]}
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 grid place-items-center rounded-xl bg-neutral-50 border border-dashed border-neutral-300">
            <img
              src={currentImage}
              alt={`${VIEW_LABEL[view]} view`}
              className="max-h-[62vh] object-contain drop-shadow-md"
              draggable={false}
            />
          </div>
        </section>

        {/* Controls */}
        <aside className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 space-y-6">
          <h2 className="text-lg font-semibold">Accessories</h2>
          {Object.keys(ACCESSORY_LABELS).map((key) => (
            <label
              key={key}
              className="flex items-start gap-3 p-3 border rounded-xl hover:bg-neutral-50 cursor-pointer"
              title={
                key === "workbox"
                  ? "Replaces the pickup bed with a utility workbox bed."
                  : "Visual overlay coming soon – state still tracked."
              }
            >
              <input
                type="checkbox"
                checked={!!accessories[key]}
                onChange={() => toggleAccessory(key)}
                className="mt-0.5 h-5 w-5 accent-black"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ACCESSORY_LABELS[key]}</span>
                  {key !== "workbox" && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                      visual TBD
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {key === "workbox"
                    ? "Swap to utility bed in all views."
                    : "Select to include in build sheet (no visual yet)."}
                </p>
              </div>
            </label>
          ))}

          <div className="h-px bg-neutral-200" />

          <BuildSheet accessories={accessories} activePack={activePack} view={view} />
        </aside>
      </main>

      <FooterNote />
    </div>
  );
}

function BuildSheet({ accessories, activePack, view }) {
  const selected = Object.entries(accessories)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Build Sheet</h3>
      <ul className="text-sm text-neutral-700 space-y-1">
        <li>
          <span className="font-medium">Body:</span> Ford F-250 Super Duty (single cab)
        </li>
        <li>
          <span className="font-medium">View:</span> {VIEW_LABEL[view]}
        </li>
        <li>
          <span className="font-medium">Visual Pack:</span> {activePack}
        </li>
        <li className="pt-1">
          <span className="font-medium">Accessories:</span>
          {selected.length === 0 ? (
            <span className="ml-2 text-neutral-500">None selected</span>
          ) : (
            <ul className="mt-2 list-disc ml-6 space-y-0.5">
              {selected.map((k) => (
                <li key={k}>{ACCESSORY_LABELS[k]}</li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

function FooterNote() {
  return (
    <footer className="px-4 py-8 text-center text-xs text-neutral-500">
      <p>Use transparent PNGs with matching dimensions across packs for perfect swaps.</p>
    </footer>
  );
}
