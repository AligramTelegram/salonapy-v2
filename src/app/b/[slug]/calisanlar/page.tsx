'use client'

import { useState } from 'react'
import { UserPlus, Pencil, Users, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStaff, type StaffFull } from '@/hooks/useStaff'
import { NewStaffModal } from '@/components/dashboard/NewStaffModal'
import { EditStaffModal } from '@/components/dashboard/EditStaffModal'

function StaffAvatar({ staff }: { staff: StaffFull }) {
  const initials = staff.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (staff.avatarUrl) {
    return (
      <img
        src={staff.avatarUrl}
        alt={staff.name}
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
      />
    )
  }

  return (
    <div
      className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white"
      style={{ backgroundColor: staff.color }}
    >
      {initials}
    </div>
  )
}

function StaffCard({
  staff,
  onEdit,
}: {
  staff: StaffFull
  onEdit: (s: StaffFull) => void
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <StaffAvatar staff={staff} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{staff.name}</h3>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: staff.color }}
              />
            </div>
            {staff.title && (
              <p className="text-sm text-gray-500 mt-0.5">{staff.title}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">{staff.email}</p>
          </div>
        </div>
        <Badge
          variant={staff.isActive ? 'default' : 'secondary'}
          className={
            staff.isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-500'
          }
        >
          {staff.isActive ? 'Aktif' : 'Pasif'}
        </Badge>
      </div>

      {/* Hizmetler */}
      {staff.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {staff.services.map((svc) => (
            <span
              key={svc.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: svc.color }}
            >
              {svc.name}
            </span>
          ))}
        </div>
      )}

      {/* Alt butonlar */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <a
          href={`/p/${staff.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Personel Paneli
        </a>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(staff)}
          className="h-7 px-2 text-gray-500 hover:text-purple-600"
        >
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Düzenle
        </Button>
      </div>
    </div>
  )
}

export default function CalisanlarPage() {
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffFull | null>(null)

  const { data: staffList = [], isLoading } = useStaff(true) // all=true → pasif dahil

  const activeCount = staffList.filter((s) => s.isActive).length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Çalışanlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} aktif çalışan
          </p>
        </div>
        <Button
          onClick={() => setNewModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Yeni Çalışan Ekle
        </Button>
      </div>

      {/* İçerik */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-purple-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Henüz çalışan yok</h3>
          <p className="text-sm text-gray-400 mb-5">
            İlk çalışanınızı ekleyerek randevu yönetimine başlayın
          </p>
          <Button
            onClick={() => setNewModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            İlk Çalışanı Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {staffList.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onEdit={setEditingStaff}
            />
          ))}
        </div>
      )}

      {/* Modaller */}
      <NewStaffModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
      />
      <EditStaffModal
        staff={editingStaff}
        open={!!editingStaff}
        onClose={() => setEditingStaff(null)}
      />
    </div>
  )
}
