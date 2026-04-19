"use client"

import { useEffect, useRef, useState } from "react"

import type { PickupPointSelection } from "@/types/shop"

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void
      Map: new (
        el: HTMLElement,
        state: { center: number[]; zoom: number; controls?: string[] },
        opts?: { suppressMapOpenBlock?: boolean },
      ) => YMap
      Placemark: new (
        coords: number[],
        props?: Record<string, unknown>,
        opts?: Record<string, unknown>,
      ) => YPlacemark
      geocode: (
        query: number[] | string,
        opts?: Record<string, unknown>,
      ) => Promise<{ geoObjects: { get: (i: number) => YGeoObject } }>
    }
  }
}

type YMap = {
  destroy: () => void
  geoObjects: { add: (o: YPlacemark) => void; remove: (o: YPlacemark) => void }
  events: { add: (ev: string, fn: (e: YMapEvent) => void) => void }
}

type YPlacemark = { geometry: { getCoordinates: () => number[] } }

type YGeoObject = { getAddressLine: () => string }

type YMapEvent = { get: (k: string) => number[] }

let ymapsScriptPromise: Promise<void> | null = null

function loadYmapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.ymaps) return Promise.resolve()
  if (ymapsScriptPromise) return ymapsScriptPromise
  ymapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src*="api-maps.yandex.ru/2.1"]`,
    )
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () =>
        reject(new Error("ymaps script error")),
      )
      return
    }
    const s = document.createElement("script")
    s.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("ymaps load failed"))
    document.head.appendChild(s)
  })
  return ymapsScriptPromise
}

type Props = {
  onSelect: (p: PickupPointSelection) => void
}

export function YandexPickupMap({ onSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [hint, setHint] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey || !hostRef.current) return

    let cancelled = false
    let map: YMap | null = null
    let placemark: YPlacemark | null = null

    void (async () => {
      try {
        await loadYmapsScript(apiKey)
        if (cancelled || !hostRef.current || !window.ymaps) return

        window.ymaps.ready(() => {
          if (cancelled || !hostRef.current || !window.ymaps) return

          map = new window.ymaps.Map(hostRef.current, {
            center: [55.7558, 37.6176],
            zoom: 11,
            controls: ["zoomControl", "fullscreenControl"],
          })

          map.events.add("click", (e: YMapEvent) => {
            const coords = e.get("coords") as number[]
            if (!window.ymaps || !map) return

            if (placemark) {
              map.geoObjects.remove(placemark)
            }
            placemark = new window.ymaps.Placemark(coords, {
              balloonContent: "Выбранная точка",
            })
            map.geoObjects.add(placemark)

            void window.ymaps.geocode(coords).then((res) => {
              const first = res.geoObjects.get(0)
              const line = first?.getAddressLine?.() ?? "Адрес уточняется"
              setHint(line)
              onSelectRef.current({
                lat: coords[0],
                lon: coords[1],
                label: line,
              })
            })
          })
        })
      } catch (e) {
        console.error(e)
        setMapError("Не удалось загрузить карту")
      }
    })()

    return () => {
      cancelled = true
      if (map) {
        try {
          map.destroy()
        } catch {
          /* ignore */
        }
      }
    }
  }, [apiKey])

  if (!apiKey) {
    return (
      <p className="text-sm text-amber-200/90">
        Карта: задайте{" "}
        <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_YANDEX_MAPS_API_KEY</code>{" "}
        в окружении. Пока укажите пункт в поле ниже.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <div
        ref={hostRef}
        className="h-[min(320px,55vw)] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/15 bg-black/20"
        role="application"
        aria-label="Карта для выбора пункта выдачи"
      />
      {mapError ? (
        <p className="text-sm text-red-300">{mapError}</p>
      ) : (
        <p className="text-xs text-white/60">
          Нажмите на карту, чтобы отметить удобный пункт выдачи (ориентир для
          менеджера).
        </p>
      )}
      {hint ? (
        <p className="text-sm text-white/85">
          <span className="text-white/55">Выбрано: </span>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
