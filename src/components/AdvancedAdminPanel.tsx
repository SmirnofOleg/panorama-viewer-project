import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import PanoramaViewer360 from '@/components/PanoramaViewer360';

interface AdvancedAdminPanelProps {
  panoramas: any[];
  onAddPanorama: (panorama: any) => void;
  onEditPanorama: (id: number, updates: any) => void;
  onDeletePanorama: (id: number) => void;
}

const AdvancedAdminPanel: React.FC<AdvancedAdminPanelProps> = ({ 
  panoramas, 
  onAddPanorama, 
  onEditPanorama, 
  onDeletePanorama 
}) => {
  const [activeTab, setActiveTab] = useState("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    tags: '',
    location: '',
    photographer: '',
    equipment: '',
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    featured: false,
    rating: 0
  });

  const categories = ['Природа', 'Архитектура', 'Путешествия', 'Интерьеры', 'События', 'Спорт'];
  const statuses = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликовано' },
    { value: 'private', label: 'Приватное' }
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      image: '',
      description: '',
      tags: '',
      location: '',
      photographer: '',
      equipment: '',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      featured: false,
      rating: 0
    });
    setEditingId(null);
    setPreviewImage('');
    setActiveTab("list");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image && !previewImage) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const panoramaData = {
      ...formData,
      image: previewImage || formData.image,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      likes: 0,
      views: Math.floor(Math.random() * 100),
      uploadDate: formData.uploadDate || new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      onEditPanorama(editingId, panoramaData);
    } else {
      onAddPanorama(panoramaData);
    }
    
    resetForm();
  };

  const startEdit = (panorama: any) => {
    setFormData({
      title: panorama.title,
      category: panorama.category,
      image: panorama.image,
      description: panorama.description,
      tags: panorama.tags?.join(', ') || '',
      location: panorama.location || '',
      photographer: panorama.photographer || '',
      equipment: panorama.equipment || '',
      uploadDate: panorama.uploadDate,
      status: panorama.status || 'published',
      featured: panorama.featured || false,
      rating: panorama.rating || 0
    });
    setEditingId(panorama.id);
    setPreviewImage(panorama.image);
    setActiveTab("add");
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { variant: 'secondary' as const, label: 'Черновик' },
      published: { variant: 'default' as const, label: 'Опубликовано' },
      private: { variant: 'outline' as const, label: 'Приватное' }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Панель управления</h2>
          <p className="text-slate-600 mt-2">Управление 360° панорамами</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab("analytics")}
            variant="outline"
          >
            <Icon name="BarChart3" size={20} className="mr-2" />
            Аналитика
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add">
            <Icon name="Plus" size={16} className="mr-2" />
            {editingId ? 'Редактирование' : 'Добавить'}
          </TabsTrigger>
          <TabsTrigger value="list">
            <Icon name="List" size={16} className="mr-2" />
            Все панорамы ({panoramas.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Icon name="Settings" size={16} className="mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Редактировать панораму' : 'Добавить новую панораму'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <PanoramaViewer360 
                          imageUrl={previewImage}
                          className="w-full h-full"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Изменить изображение
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Icon name="Upload" size={48} className="mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Загрузите 360° панораму</h3>
                      <p className="text-slate-600 mb-4">
                        Перетащите файл сюда или кликните для выбора
                      </p>
                      <Button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Выбрать файл
                      </Button>
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-slate-600 mt-2">Загрузка: {uploadProgress}%</p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Название *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        placeholder="Например: Горные вершины Альп"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Категория *</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Местоположение</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Например: Швейцария, Альпы"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Фотограф</label>
                      <Input
                        value={formData.photographer}
                        onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                        placeholder="Имя автора"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Статус</label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Оборудование</label>
                      <Input
                        value={formData.equipment}
                        onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                        placeholder="Например: Canon EOS R5, 360° камера"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Дата съёмки</label>
                      <Input
                        type="date"
                        value={formData.uploadDate}
                        onChange={(e) => setFormData({...formData, uploadDate: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="featured" className="text-sm font-medium">
                        Рекомендуемая панорама
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    placeholder="Подробное описание панорамы..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Теги</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="горы, снег, пейзаж, альпы, природа"
                  />
                  <p className="text-xs text-slate-500 mt-1">Разделяйте теги запятыми</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isUploading}>
                    <Icon name="Save" size={16} className="mr-2" />
                    {editingId ? 'Сохранить изменения' : 'Добавить панораму'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <Icon name="X" size={16} className="mr-2" />
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {panoramas.map((panorama) => (
              <Card key={panorama.id} className="overflow-hidden">
                <div className="relative">
                  <div className="h-48">
                    <PanoramaViewer360 
                      imageUrl={panorama.image}
                      className="w-full h-full"
                    />
                  </div>
                  <Badge 
                    className="absolute top-3 right-3"
                    variant={getStatusBadge(panorama.status).variant}
                  >
                    {getStatusBadge(panorama.status).label}
                  </Badge>
                  {panorama.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500">
                      <Icon name="Star" size={12} className="mr-1" />
                      Рекомендуемая
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{panorama.title}</h3>
                    <div className="flex items-center text-sm text-amber-600">
                      <Icon name="Star" size={14} className="mr-1 fill-current" />
                      {panorama.rating || 0}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-600">{panorama.category}</p>
                    {panorama.location && (
                      <p className="text-sm text-slate-500 flex items-center">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {panorama.location}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 line-clamp-2">{panorama.description}</p>
                  </div>
                  
                  <div className="flex gap-1 mb-4 flex-wrap">
                    {panorama.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {panorama.tags?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{panorama.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex gap-4">
                      <span className="flex items-center">
                        <Icon name="Heart" size={12} className="mr-1" />
                        {panorama.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Eye" size={12} className="mr-1" />
                        {panorama.views || 0}
                      </span>
                    </div>
                    <span>{panorama.uploadDate}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startEdit(panorama)}
                      className="flex-1"
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeletePanorama(panorama.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Всего панорам</p>
                    <p className="text-3xl font-bold">{panoramas.length}</p>
                  </div>
                  <Icon name="Camera" size={32} className="text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Всего лайков</p>
                    <p className="text-3xl font-bold">
                      {panoramas.reduce((sum, p) => sum + (p.likes || 0), 0)}
                    </p>
                  </div>
                  <Icon name="Heart" size={32} className="text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Всего просмотров</p>
                    <p className="text-3xl font-bold">
                      {panoramas.reduce((sum, p) => sum + (p.views || 0), 0)}
                    </p>
                  </div>
                  <Icon name="Eye" size={32} className="text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Популярные категории</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(category => {
                  const count = panoramas.filter(p => p.category === category).length;
                  const percentage = panoramas.length > 0 ? (count / panoramas.length) * 100 : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={percentage} className="w-32" />
                        <span className="text-sm text-slate-600 w-12">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки платформы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Общие настройки</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Автоматическая публикация</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Модерация комментариев</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Публичный доступ к API</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Настройки качества</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Максимальный размер файла (МБ)</label>
                      <Input type="number" defaultValue="50" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Качество сжатия</label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкое</SelectItem>
                          <SelectItem value="medium">Среднее</SelectItem>
                          <SelectItem value="high">Высокое</SelectItem>
                          <SelectItem value="lossless">Без потерь</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAdminPanel;