import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface AdminPanelProps {
  panoramas: any[];
  onAddPanorama: (panorama: any) => void;
  onEditPanorama: (id: number, updates: any) => void;
  onDeletePanorama: (id: number) => void;
}

const AdminPanel = ({ panoramas, onAddPanorama, onEditPanorama, onDeletePanorama }: AdminPanelProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    tags: '',
    status: 'published'
  });

  const categories = ['Природа', 'Архитектура', 'Путешествия'];

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      image: '',
      description: '',
      tags: '',
      status: 'published'
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const panoramaData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
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
      tags: panorama.tags.join(', '),
      status: panorama.status || 'published'
    });
    setEditingId(panorama.id);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Управление панорамами</h2>
        <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew || editingId !== null}>
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить панораму
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Редактировать панораму' : 'Добавить новую панораму'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Теги (через запятую)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="пляж, океан, тропики"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Icon name="Save" size={16} className="mr-2" />
                  {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <Icon name="X" size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Panoramas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panoramas.map((panorama) => (
          <Card key={panorama.id}>
            <div className="relative">
              <img 
                src={panorama.image} 
                alt={panorama.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                className="absolute top-2 right-2"
                variant={panorama.status === 'published' ? 'default' : 'secondary'}
              >
                {panorama.status === 'published' ? 'Опубликовано' : 'Черновик'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{panorama.title}</h3>
              <p className="text-sm text-slate-600 mb-2">{panorama.category}</p>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{panorama.description}</p>
              
              <div className="flex gap-1 mb-3 flex-wrap">
                {panorama.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex gap-3">
                  <span>❤️ {panorama.likes}</span>
                  <span>👁️ {panorama.views}</span>
                </div>
                <span>{panorama.uploadDate}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => startEdit(panorama)}
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
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;