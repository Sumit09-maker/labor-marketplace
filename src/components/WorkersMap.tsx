"use client";

import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { DELHI_CENTER, initials, skillLabel } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import type { WorkerListItem } from "@/components/WorkerCard";

function workerIcon(worker: WorkerListItem) {
  return L.divIcon({
    className: "lc-pin",
    html: `<div style="width:44px;height:44px;border-radius:14px;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;font-family:Poppins,sans-serif;background:${worker.available ? "linear-gradient(135deg,#26537f,#122640)" : "linear-gradient(135deg,#9ca3af,#6b7280)"}">${initials(worker.name)}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
}

const userIcon = L.divIcon({
  className: "lc-pin",
  html: `<div style="width:22px;height:22px;border-radius:9999px;background:#f59e0b;border:4px solid #fff;box-shadow:0 0 0 8px rgba(245,158,11,.25),0 6px 16px rgba(0,0,0,.3)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function RecenterOnUser({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 12, { duration: 1.2 });
  }, [position, map]);
  return null;
}

export default function WorkersMap({
  workers,
  userPosition,
}: {
  workers: WorkerListItem[];
  userPosition: { lat: number; lng: number } | null;
}) {
  const center = useMemo(
    () => userPosition ?? DELHI_CENTER,
    [userPosition],
  );

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full rounded-3xl"
      style={{ minHeight: "420px", background: "#f8f5ee" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterOnUser position={userPosition} />

      {userPosition && (
        <>
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>
              <p className="text-sm font-bold text-blue-600">Your current location</p>
            </Popup>
          </Marker>
          <Circle
            center={[userPosition.lat, userPosition.lng]}
            radius={5000}
            pathOptions={{ color: "#26537f", weight: 1.5, fillColor: "#26537f", fillOpacity: 0.06, dashArray: "6 6" }}
          />
        </>
      )}

      {workers.map((w) => (
        <Marker key={w.id} position={[w.lat, w.lng]} icon={workerIcon(w)}>
          <Popup className="lc-popup">
            <div>
              <p className="text-sm font-extrabold text-gray-900">{w.name}</p>
              <p className="text-xs font-semibold text-orange-600">{skillLabel(w.skill)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {w.area}, {w.city} · {formatINR(w.dailyRate)}/day
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/workers/${w.id}`}
                  className="rounded-lg bg-gradient-to-r from-saffron-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white no-underline"
                >
                  View Profile
                </Link>
                <a
                  href={`tel:+91${w.phone}`}
                  className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-bold text-green-600 no-underline"
                >
                  Call
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
