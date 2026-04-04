'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Calendar,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  User,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from 'lucide-react'

// Örnek randevu verisi
const appointments = [
  { id: 1, customer: 'Ayşe Yılmaz', service: 'Saç Kesimi', staff: 'Mehmet Usta', time: '09:00', status: 'ONAYLANDI', price: '₺250' },
  { id: 2, customer: 'Fatma Kaya', service: 'Boya + Kesim', staff: 'Zeynep Hanım', time: '10:30', status: 'BEKLIYOR', price: '₺450' },
  { id: 3, customer: 'Ali Demir', service: 'Sakal Tıraşı', staff: 'Mehmet Usta', time: '11:00', status: 'TAMAMLANDI', price: '₺80' },
  { id: 4, customer: 'Elif Şahin', service: 'Manikür', staff: 'Zeynep Hanım', time: '13:00', status: 'IPTAL', price: '₺120' },
]

const statusConfig = {
  ONAYLANDI: { label: 'Onaylandı', class: 'bg-purple-100 text-purple-700 border-purple-200' },
  BEKLIYOR: { label: 'Bekliyor', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  TAMAMLANDI: { label: 'Tamamlandı', class: 'bg-green-100 text-green-700 border-green-200' },
  IPTAL: { label: 'İptal', class: 'bg-red-100 text-red-700 border-red-200' },
  GELMEDI: { label: 'Gelmedi', class: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default function TestComponentsPage() {
  const [switchValue, setSwitchValue] = useState(true)
  const [activeTab, setActiveTab] = useState('bugun')

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#faf8ff] p-6 space-y-10">
        <div className="max-w-5xl mx-auto">

          {/* Başlık */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-1">
              Bileşen Test Sayfası
            </h1>
            <p className="text-gray-500 text-sm">shadcn/ui — Mor Tema ile Uyumlu</p>
          </div>

          {/* ── 1. BUTTON ── */}
          <section>
            <SectionTitle>Button</SectionTitle>
            <div className="flex flex-wrap gap-3 items-center">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 shadow-purple-sm hover:shadow-purple-md hover:-translate-y-0.5 transition-all">
                <Plus className="mr-1 h-4 w-4" />
                Randevu Ekle
              </Button>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 2. CARD ── */}
          <section>
            <SectionTitle>Card</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Standart Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Standart Card</CardTitle>
                  <CardDescription>shadcn/ui varsayılan kart stili</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Kart içeriği buraya gelir.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">İncele</Button>
                </CardFooter>
              </Card>

              {/* Glass Card */}
              <div className="glass-card p-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-display font-bold text-base text-gray-900 mb-1">
                  Glass Card
                </h3>
                <p className="text-sm text-gray-500">
                  Backdrop blur + glassmorphism efekti
                </p>
                <div className="mt-4 pt-4 border-t border-white/50 flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">142</span>
                  <span className="text-xs text-gray-400">Bu ay</span>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Toplam Gelir</p>
                    <p className="text-3xl font-display font-bold mt-1">₺12,450</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💰</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-300">↑ %18</span>
                  <span className="text-purple-200">geçen aya göre</span>
                </div>
              </div>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 3. FORM ELEMENTLERİ ── */}
          <section>
            <SectionTitle>Input + Label + Select + Textarea</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input id="name" placeholder="Ayşe Yılmaz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+90 555 000 00 00" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Hizmet</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Hizmet seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sacKesimi">Saç Kesimi — 250₺</SelectItem>
                    <SelectItem value="boya">Boya + Kesim — 450₺</SelectItem>
                    <SelectItem value="manikur">Manikür — 120₺</SelectItem>
                    <SelectItem value="sakal">Sakal Tıraşı — 80₺</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" placeholder="ayse@email.com" type="email" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea id="notes" placeholder="Müşteri hakkında not..." rows={3} />
              </div>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 4. BADGE + AVATAR ── */}
          <section>
            <SectionTitle>Badge + Avatar</SectionTitle>
            <div className="space-y-4">
              {/* Randevu durumu badge'leri */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <span
                    key={key}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${val.class}`}
                  >
                    {val.label}
                  </span>
                ))}
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>

              {/* Avatar örnekleri */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">AY</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">FK</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-green-100 text-green-700 font-bold">MU</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">ZH</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Zeynep Hanım</p>
                      <p className="text-xs text-gray-500">Kuaför Ustası</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 5. TABS ── */}
          <section>
            <SectionTitle>Tabs</SectionTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-purple-50 border border-purple-100">
                <TabsTrigger
                  value="bugun"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Bugün
                </TabsTrigger>
                <TabsTrigger
                  value="hafta"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Bu Hafta
                </TabsTrigger>
                <TabsTrigger
                  value="ay"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Bu Ay
                </TabsTrigger>
              </TabsList>
              <TabsContent value="bugun" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">Bugün <strong className="text-purple-600">8 randevu</strong> var.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hafta" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">Bu hafta <strong className="text-purple-600">34 randevu</strong> var.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ay" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">Bu ay <strong className="text-purple-600">142 randevu</strong> tamamlandı.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 6. SWITCH + TOOLTIP ── */}
          <section>
            <SectionTitle>Switch + Tooltip</SectionTitle>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <Switch
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label>WhatsApp Bildirimleri {switchValue ? '✓ Açık' : '✗ Kapalı'}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch className="data-[state=checked]:bg-purple-600" defaultChecked />
                <Label>Email Hatırlatmaları</Label>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-purple-600 text-white border-purple-600">
                  <p>Bildirimler</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-purple-600 text-white border-purple-600">
                  <p>Ayarlar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 7. DIALOG ── */}
          <section>
            <SectionTitle>Dialog</SectionTitle>
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Randevu
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display font-bold text-xl">
                      Yeni Randevu Ekle
                    </DialogTitle>
                    <DialogDescription>
                      Müşteri bilgilerini girin ve randevuyu kaydedin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Müşteri Adı</Label>
                      <Input placeholder="Ad Soyad" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hizmet</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Hizmet seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sacKesimi">Saç Kesimi</SelectItem>
                          <SelectItem value="boya">Boya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tarih & Saat</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">İptal</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Kaydet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    İşlemler <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Hesap</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4 text-purple-600" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-purple-600" />
                    Ayarlar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </section>

          <Separator className="bg-purple-100" />

          {/* ── 8. TABLE ── */}
          <section>
            <SectionTitle>Table — Randevu Listesi</SectionTitle>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-purple-50">
              {/* Tablo başlık */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-display font-semibold text-gray-900">Bugünkü Randevular</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    <Filter className="mr-1 h-3 w-3" />
                    Filtrele
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-1 h-3 w-3" />
                    Yeni
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700">Müşteri</TableHead>
                    <TableHead className="font-semibold text-gray-700">Hizmet</TableHead>
                    <TableHead className="font-semibold text-gray-700">Personel</TableHead>
                    <TableHead className="font-semibold text-gray-700">Saat</TableHead>
                    <TableHead className="font-semibold text-gray-700">Durum</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Ücret</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => {
                    const status = statusConfig[apt.status as keyof typeof statusConfig]
                    return (
                      <TableRow key={apt.id} className="hover:bg-purple-50/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                                {apt.customer.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 text-sm">{apt.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{apt.service}</TableCell>
                        <TableCell className="text-sm text-gray-600">{apt.staff}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm font-semibold text-gray-900">{apt.time}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${status.class}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 text-sm">
                          {apt.price}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-purple-50">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pb-8 pt-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              Oturum 4 — shadcn/ui bileşenleri mor temaya entegre edildi
            </span>
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-display font-bold text-lg text-gray-900">{children}</h2>
      <div className="h-0.5 w-12 bg-purple-600 rounded-full mt-1" />
    </div>
  )
}
