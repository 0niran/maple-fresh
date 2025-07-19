'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Upload, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Camera, 
  Video,
  Paperclip,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form validation schema
const customQuoteSchema = z.object({
  // Contact Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  
  // Property Information
  address: z.string().min(5, 'Property address is required'),
  propertyType: z.enum(['house', 'condo', 'apartment', 'office', 'warehouse', 'retail']),
  squareFootage: z.number().min(100, 'Square footage is required'),
  
  // Service Details
  serviceTypes: z.array(z.string()).min(1, 'Select at least one service'),
  urgency: z.enum(['asap', 'within_week', 'within_month', 'flexible']),
  budget: z.string().optional(),
  
  // Project Description
  projectDescription: z.string().min(10, 'Please describe your project needs'),
  specialRequirements: z.string().optional(),
  
  // Scheduling
  preferredDate: z.string().optional(),
  timeFlexibility: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
});

type CustomQuoteFormData = z.infer<typeof customQuoteSchema>;

interface CustomQuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomQuoteForm({ isOpen, onClose }: CustomQuoteFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<CustomQuoteFormData>({
    resolver: zodResolver(customQuoteSchema),
    defaultValues: {
      serviceTypes: [],
      timeFlexibility: 'anytime',
      urgency: 'flexible'
    }
  });

  const serviceTypes = [
    { id: 'moving', label: 'Moving Services' },
    { id: 'cleaning', label: 'Cleaning Services' },
    { id: 'handyman', label: 'Handyman Services' },
    { id: 'maintenance', label: 'Ongoing Maintenance' },
    { id: 'renovation', label: 'Renovation Support' },
    { id: 'organization', label: 'Organization Services' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleServiceTypeChange = (serviceId: string, checked: boolean) => {
    const currentServices = watch('serviceTypes') || [];
    if (checked) {
      setValue('serviceTypes', [...currentServices, serviceId]);
    } else {
      setValue('serviceTypes', currentServices.filter(id => id !== serviceId));
    }
  };

  const onSubmit = async (data: CustomQuoteFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form Data:', data);
    console.log('Uploaded Files:', uploadedFiles);
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      reset();
      setUploadedFiles([]);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Custom Quote Request</h2>
                <p className="text-blue-100">Tell us about your specific needs</p>
              </div>
            </div>
          </div>

          {/* Success State */}
          {submitSuccess && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h3>
                <p className="text-gray-600 mb-4">
                  We&apos;ll review your request and get back to you within 24 hours.
                </p>
                <p className="text-sm text-gray-500">
                  You&apos;ll receive a confirmation email shortly.
                </p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className="mt-1"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className="mt-1"
                      placeholder="Smith"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1"
                      placeholder="john@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      className="mt-1"
                      placeholder="(519) 555-0123"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Property Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Property Address *</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      className="mt-1"
                      placeholder="123 Main Street, Brantford, ON"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <select
                        {...register('propertyType')}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select property type</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="apartment">Apartment</option>
                        <option value="office">Office</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="retail">Retail Space</option>
                      </select>
                      {errors.propertyType && (
                        <p className="text-red-600 text-sm mt-1">{errors.propertyType.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="squareFootage">Square Footage *</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        {...register('squareFootage', { valueAsNumber: true })}
                        className="mt-1"
                        placeholder="1500"
                      />
                      {errors.squareFootage && (
                        <p className="text-red-600 text-sm mt-1">{errors.squareFootage.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Services Needed *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => handleServiceTypeChange(service.id, e.target.checked)}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {service.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.serviceTypes && (
                  <p className="text-red-600 text-sm mt-2">{errors.serviceTypes.message}</p>
                )}
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <textarea
                      id="projectDescription"
                      {...register('projectDescription')}
                      rows={4}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe what you need help with in detail..."
                    />
                    {errors.projectDescription && (
                      <p className="text-red-600 text-sm mt-1">{errors.projectDescription.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <textarea
                      id="specialRequirements"
                      {...register('specialRequirements')}
                      rows={3}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special access requirements, materials, or considerations..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="urgency">Timeline *</Label>
                      <select
                        {...register('urgency')}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="asap">ASAP</option>
                        <option value="within_week">Within a week</option>
                        <option value="within_month">Within a month</option>
                        <option value="flexible">Flexible timing</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Input
                        id="budget"
                        {...register('budget')}
                        className="mt-1"
                        placeholder="$500 - $1000 (optional)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-purple-600" />
                  Photos & Videos
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-2 mb-4">
                        <Camera className="h-8 w-8 text-gray-400" />
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Upload photos or videos
                      </p>
                      <p className="text-sm text-gray-500">
                        Help us understand your project better
                      </p>
                    </div>
                  </label>
                </div>
                
                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded files ({uploadedFiles.length}):
                    </p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting Request...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Submit Quote Request
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  We&apos;ll review your request and contact you within 24 hours with a detailed quote.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}