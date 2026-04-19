import { CabinetPanel } from "@/components/shop/cabinet-panel"

export const metadata = {
  title: "Личный кабинет — Территория любви",
}

export default function CabinetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-10 space-y-2">
        <h1 className="tl-gradient-title text-[clamp(1.75rem,4vw,2.5rem)]">
          Личный кабинет
        </h1>
        <p className="text-white/70">
          История заказов в этом браузере, поиск по номеру и сохранённые адреса.
        </p>
      </header>
      <CabinetPanel />
    </div>
  )
}
