import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface Panorama {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
  uploadDate: string;
  status: 'published' | 'draft';
}

interface AdminPanelProps {
  panoramas: Panorama[];
  onAddPanorama: (panorama: Omit<Panorama, 'id' | 'likes' | 'views' | 'uploadDate'>) => void;
  onEditPanorama: (id: number, panorama: Partial<Panorama>) => void;
  onDeletePanorama: (id: number) => void;
}

export default function AdminPanel({ panoramas, onAddPanorama, onEditPanorama, onDeletePanorama }: AdminPanelProps) {
  const [newPanorama, setNewPanorama] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    tags: '',
    status: 'draft' as const
  });
  
  const [editingPanorama, setEditingPanorama] = useState<Panorama | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleAddPanorama = () => {
    if (!newPanorama.title || !newPanorama.category || !newPanorama.image) {
      setUploadStatus('error');
      return;
    }

    const panoramaData = {
      ...newPanorama,
      tags: newPanorama.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    onAddPanorama(panoramaData);
    
    setNewPanorama({
      title: '',
      category: '',
      image: '',
      description: '',
      tags: '',
      status: 'draft'
    });
    
    setUploadStatus('success');
    setTimeout(() => setUploadStatus('idle'), 3000);
  };

  const handleEditPanorama = () => {
    if (!editingPanorama) return;
    
    onEditPanorama(editingPanorama.id, editingPanorama);
    setEditingPanorama(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    
    // Симуляция загрузки файла
    setTimeout(() => {
      const fakeUrl = `/img/uploaded-${Date.now()}.jpg`;
      
      if (isEdit && editingPanorama) {
        setEditingPanorama({
          ...editingPanorama,
          image: fakeUrl
        });
      } else {
        setNewPanorama(prev => ({
          ...prev,
          image: fakeUrl
        }));
      }
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 2000);
  };

  const stats = {
    totalPanoramas: panoramas.length,
    published: panoramas.filter(p => p.status === 'published').length,
    drafts: panoramas.filter(p => p.status === 'draft').length,
    totalViews: panoramas.reduce((sum, p) => sum + p.views, 0),
    totalLikes: panoramas.reduce((sum, p) => sum + p.likes, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Панель управления</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить панораму
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новая панорама</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {uploadStatus === 'success' && (
                <Alert>
                  <Icon name="CheckCircle" size={16} />
                  <AlertDescription>
                    Панорама успешно добавлена!
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadStatus === 'error' && (
                <Alert variant="destructive">
                  <Icon name="AlertCircle" size={16} />
                  <AlertDescription>
                    Заполните все обязательные поля!
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название *</label>
                  <Input
                    value={newPanorama.title}
                    onChange={(e) => setNewPanorama(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Горные вершины"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Категория *</label>
                  <Select
                    value={newPanorama.category}
                    onValueChange={(value) => setNewPanorama(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Природа">Природа</SelectItem>
                      <SelectItem value="Архитектура">Архитектура</SelectItem>
                      <SelectItem value="Путешествия">Путешествия</SelectItem>
                      <SelectItem value="Спорт">Спорт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Изображение *</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="flex-1"
                  />
                  {uploadStatus === 'uploading' && (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  )}
                </div>
                {newPanorama.image && (
                  <div className="mt-2">
                    <img 
                      src={newPanorama.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={newPanorama.description}
                  onChange={(e) => setNewPanorama(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Красивое описание панорамы..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Теги (через запятую)</label>
                <Input
                  value={newPanorama.tags}
                  onChange={(e) => setNewPanorama(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="горы, снег, природа"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <Select
                  value={newPanorama.status}
                  onValueChange={(value: 'published' | 'draft') => 
                    setNewPanorama(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="published">Опубликовано</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddPanorama} className="w-full">
                <Icon name="Upload" size={16} className="mr-2" />
                Добавить панораму
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="panoramas">Панорамы</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего панорам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPanoramas}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Опубликовано</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Черновики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Лайки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.totalLikes}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="panoramas">
          <Card>
            <CardHeader>
              <CardTitle>Управление панорамами</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Превью</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Лайки</TableHead>
                    <TableHead>Просмотры</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panoramas.map((panorama) => (
                    <TableRow key={panorama.id}>
                      <TableCell>
                        <img 
                          src={panorama.image} 
                          alt={panorama.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{panorama.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{panorama.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={panorama.status === 'published' ? 'default' : 'secondary'}>
                          {panorama.status === 'published' ? 'Опубликовано' : 'Черновик'}
                        </Badge>
                      </TableCell>
                      <TableCell>{panorama.likes}</TableCell>
                      <TableCell>{panorama.views}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingPanorama(panorama)}
                              >
                                <Icon name="Edit" size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Редактировать панораму</DialogTitle>
                              </DialogHeader>
                              {editingPanorama && (
                                <div className="space-y-4">
                                  <Input
                                    value={editingPanorama.title}
                                    onChange={(e) => setEditingPanorama(prev => 
                                      prev ? { ...prev, title: e.target.value } : null
                                    )}
                                    placeholder="Название"
                                  />
                                  <Select
                                    value={editingPanorama.category}
                                    onValueChange={(value) => setEditingPanorama(prev =>
                                      prev ? { ...prev, category: value } : null
                                    )}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Природа">Природа</SelectItem>
                                      <SelectItem value="Архитектура">Архитектура</SelectItem>
                                      <SelectItem value="Путешествия">Путешествия</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Textarea
                                    value={editingPanorama.description}
                                    onChange={(e) => setEditingPanorama(prev =>
                                      prev ? { ...prev, description: e.target.value } : null
                                    )}
                                    placeholder="Описание"
                                  />
                                  <Button onClick={handleEditPanorama}>
                                    Сохранить изменения
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDeletePanorama(panorama.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Популярные категории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Природа', 'Архитектура', 'Путешествия'].map(category => {
                    const count = panoramas.filter(p => p.category === category).length;
                    const percentage = panoramas.length > 0 ? (count / panoramas.length) * 100 : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Топ панорам по лайкам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {panoramas
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 5)
                    .map((panorama, index) => (
                      <div key={panorama.id} className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                        <img 
                          src={panorama.image} 
                          alt={panorama.title}
                          className="w-10 h-6 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{panorama.title}</p>
                        </div>
                        <span className="text-sm text-gray-600">{panorama.likes} ❤️</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}