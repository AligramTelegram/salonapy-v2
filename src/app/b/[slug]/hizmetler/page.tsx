'use client'

import { useState } from 'react'
import { Plus, Pencil, Scissors, Clock, Banknote, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useServices, type ServiceFull } from '@/hooks/useServices'
import { ServiceModal } from '@/components/dashboard/ServiceModal'

function durationLabel(min: number): string {
  if (min < 60) return `${min} dk`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}s ${m}dk` : `${h} saat`
}

function StaffAvatars({ staff }: { staff: ServiceFull['staff'] }) {
  if (staff.length === 0) {
    return <span className="text-xs text-gray-400">Personel atanmadı</span>
  }
  return (
    <div className="flex items-center gap-1">
      {staff.slice(0, 4).map((s) => (
        <div
          key={s.id}
          title={s.name}
          className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold ring-1 ring-white"
          style={{ backgroundColor: s.color }}
        >
          {s.name[0].toUpperCase()}
        </div>
      ))}
      {staff.length > 4 && (
        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium ring-1 ring-white">
          +{staff.length - 4}
        </div>
      )}
    </div>
  )
}

function ServiceCard({
  service,
  onEdit,
}: {
  service: ServiceFull
  onEdit: (s: ServiceFull) => void
}) {
  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Renk şeridi */}
      <div className="h-1.5 w-full" style={{ backgroundColor: service.color }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Başlık + badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{service.name}</h3>
            {service.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</p>
            )}
          </div>
          <Badge
            variant={service.isActive ? 'default' : 'secondary'}
            className={
              service.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-100 shrink-0'
                : 'bg-gray-100 text-gray-500 shrink-0'
            }
          >
            {service.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>

        {/* Süre + Fiyat */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="h-4 w-4" style={{ color: service.color }} />
            <span className="text-sm font-medium">{durationLabel(service.duration)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote className="h-4 w-4 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">
              ₺{service.price.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        {/* Personeller */}
        <StaffAvatars staff={service.staff} />

        {/* Düzenle butonu */}
        <div className="pt-2 border-t border-gray-100 mt-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(service)}
            className="w-full text-gray-500 hover:text-purple-600 hover:bg-purple-50"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Düzenle
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HizmetlerPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceFull | null>(null)

  const { data: serviceList = [], isLoading } = useServices(true)

  const activeCount = serviceList.filter((s) => s.isActive).length

  function openNew() {
    setEditingService(null)
    setModalOpen(true)
  }

  function openEdit(service: ServiceFull) {
    setEditingService(service)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditingService(null)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Hizmetler</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} aktif hizmet
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Hizmet Ekle
        </Button>
      </div>

      {/* İçerik */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="h-1.5 bg-purple-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : serviceList.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Henüz hizmet yok</h3>
          <p className="text-sm text-gray-400 mb-5">
            İlk hizmetinizi ekleyerek randevu sistemini kullanmaya başlayın
          </p>
          <Button
            onClick={openNew}
            className="bg-purple-600 hover:bg-purple-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            İlk Hizmeti Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {serviceList.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ServiceModal
        service={editingService}
        open={modalOpen}
        onClose={handleClose}
      />
    </div>
  )
}
