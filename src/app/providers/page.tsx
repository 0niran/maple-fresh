'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Star, User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/layout/Navigation';

const providerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  workingHours: z.string().optional(),
  isVerified: z.boolean().default(false),
  backgroundCheck: z.boolean().default(false),
  insurance: z.boolean().default(false),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface ServiceProvider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  totalJobs: number;
  isActive: boolean;
  isVerified: boolean;
  backgroundCheck: boolean;
  insurance: boolean;
  serviceAreas: string[];
  workingHours?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ServiceProvider | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      services: [],
      serviceAreas: [],
      isVerified: false,
      backgroundCheck: false,
      insurance: false,
    },
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers');
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProviderFormData) => {
    try {
      const method = editingProvider ? 'PUT' : 'POST';
      const url = editingProvider ? `/api/providers/${editingProvider.id}` : '/api/providers';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        fetchProviders();
        setShowForm(false);
        setEditingProvider(null);
        reset();
      } else {
        throw new Error(result.error || 'Failed to save provider');
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      alert('Error saving provider. Please try again.');
    }
  };

  const deleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;

    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchProviders();
      } else {
        throw new Error(result.error || 'Failed to delete provider');
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      alert('Error deleting provider. Please try again.');
    }
  };

  const handleEdit = (provider: ServiceProvider) => {
    setEditingProvider(provider);
    reset({
      firstName: provider.firstName,
      lastName: provider.lastName,
      email: provider.email,
      phone: provider.phone,
      services: Array.isArray(provider.services) ? provider.services : JSON.parse(provider.services || '[]'),
      serviceAreas: Array.isArray(provider.serviceAreas) ? provider.serviceAreas : JSON.parse(provider.serviceAreas || '[]'),
      workingHours: provider.workingHours,
      isVerified: provider.isVerified,
      backgroundCheck: provider.backgroundCheck,
      insurance: provider.insurance,
    });
    setShowForm(true);
  };

  const getVerificationStatus = (provider: ServiceProvider) => {
    if (provider.isVerified && provider.backgroundCheck && provider.insurance) {
      return { status: 'Fully Verified', color: 'text-green-600', icon: CheckCircle };
    } else if (provider.isVerified) {
      return { status: 'Partially Verified', color: 'text-yellow-600', icon: AlertCircle };
    }
    return { status: 'Unverified', color: 'text-red-600', icon: AlertCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation variant="admin" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Providers</h1>
            <p className="text-gray-600 mt-2">Manage your network of service professionals</p>
          </div>
          <Button
            onClick={() => {
              setEditingProvider(null);
              reset();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.filter(p => p.isVerified && p.backgroundCheck && p.insurance).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.length > 0 
                    ? (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {providers.filter(p => !p.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProvider ? 'Edit Provider' : 'Add New Provider'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Services *</Label>
                  <div className="space-y-2">
                    {['moving', 'cleaning', 'handyman'].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          value={service}
                          {...register('services')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 capitalize">{service}</span>
                      </label>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-600 text-xs mt-1">{errors.services.message}</p>
                  )}
                </div>

                {/* Verification */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Verification Status</Label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isVerified')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2">Identity Verified</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('backgroundCheck')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2">Background Check Complete</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('insurance')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2">Insurance Verified</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProvider(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProvider ? 'Update Provider' : 'Add Provider'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Providers List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Providers</h2>
            
            {providers.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No providers yet</h3>
                <p className="text-gray-600">Add your first service provider to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((provider) => {
                  const verification = getVerificationStatus(provider);
                  const StatusIcon = verification.icon;
                  
                  return (
                    <div key={provider.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {provider.firstName} {provider.lastName}
                            </h3>
                            <div className={`ml-3 flex items-center ${verification.color}`}>
                              <StatusIcon className="w-4 h-4 mr-1" />
                              <span className="text-xs font-medium">{verification.status}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Email:</strong> {provider.email}</p>
                              <p><strong>Phone:</strong> {provider.phone}</p>
                            </div>
                            <div>
                              <p><strong>Services:</strong> {
                                Array.isArray(provider.services) 
                                  ? provider.services.join(', ')
                                  : JSON.parse(provider.services || '[]').join(', ')
                              }</p>
                              <p><strong>Rating:</strong> {provider.rating.toFixed(1)} ⭐ ({provider.totalJobs} jobs)</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(provider)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProvider(provider.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}