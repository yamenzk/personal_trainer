import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import {
  User, Calendar, Ruler, Weight, Target,
  Dumbbell, Clock, Goal, Apple, ArrowRight,
  ArrowLeft, Loader, Check, Mail, Phone,
  Lock as LockIcon
} from 'lucide-react';

// Helper Components
const NumberInput = ({ value, onChange, unit, placeholder, min, max }) => (
  <div className="relative">
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={value?.toString() || ''}
      onChange={(e) => {
        const val = e.target.value.replace(/[^\d.]/g, '');
        if (!val || (val && !isNaN(val))) {
          onChange(val ? Number(val) : '');
        }
      }}
      placeholder={placeholder}
      className="ios-input pr-16"
      min={min}
      max={max}
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
      {unit}
    </div>
  </div>
);

const OptionButton = ({ selected, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-4 py-3 rounded-xl
      transition-all duration-100
      ${selected 
        ? 'bg-brand text-white' 
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-brand/10'
      }
    `}
  >
    <div className="flex items-center space-x-3">
      <div className={`
        p-2 rounded-xl transition-all duration-100
        ${selected 
          ? 'bg-white/20' 
          : 'bg-brand/10 text-brand group-hover:bg-brand/20'
        }
      `}>
        <Icon className="w-5 h-5" />
      </div>
      {children}
    </div>
    {selected && <Check className="w-5 h-5" />}
  </button>
);

const DateSelector = React.memo(({ value, onChange }) => {
  const [localDate, setLocalDate] = useState(() => {
    if (!value) return { year: '', month: '', day: '' };
    try {
      const date = new Date(value);
      return {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        day: date.getDate().toString().padStart(2, '0')
      };
    } catch {
      return { year: '', month: '', day: '' };
    }
  });

  const handleDateChange = useCallback((field, newValue) => {
    setLocalDate(prev => {
      const updated = { ...prev, [field]: newValue };
      if (updated.year && updated.month && updated.day) {
        try {
          const dateStr = `${updated.year}-${updated.month}-${updated.day}`;
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            onChange(dateStr);
          }
        } catch (error) {
          console.error('Invalid date:', error);
        }
      }
      return updated;
    });
  }, [onChange]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const daysInMonth = localDate.year && localDate.month
    ? new Date(Number(localDate.year), Number(localDate.month), 0).getDate()
    : 31;

  return (
    <div className="grid grid-cols-3 gap-4">
      <select 
        className="ios-input"
        value={localDate.year}
        onChange={(e) => handleDateChange('year', e.target.value)}
      >
        <option value="">Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select 
        className="ios-input"
        value={localDate.month}
        onChange={(e) => handleDateChange('month', e.target.value)}
      >
        <option value="">Month</option>
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select 
        className="ios-input"
        value={localDate.day}
        onChange={(e) => handleDateChange('day', e.target.value)}
      >
        <option value="">Day</option>
        {Array.from({ length: daysInMonth }, (_, i) => 
          (i + 1).toString().padStart(2, '0')
        ).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );
});

DateSelector.displayName = 'DateSelector';

// Helper functions
const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
};

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Setup steps configuration
const setupSteps = {
  client_name: {
    title: "What's your name?",
    description: "Please enter your full name.",
    icon: User,
    render: ({ value, onChange }) => (
      <input
        type="text"
        placeholder="Full Name"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="ios-input"
        autoComplete="off"
      />
    ),
    validate: value => !value?.trim() ? 'Please enter your name' : null
  },
  email: {
    title: "What's your email address?",
    description: "We'll send your workout plans and progress updates here.",
    icon: Mail,
    render: ({ value, onChange }) => (
      <div className="space-y-4">
        <div className="relative group">
          <input
            type="email"
            placeholder="Enter your email address"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="ios-input pr-12"
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Mail className={`
              w-5 h-5 transition-colors duration-200
              ${validateEmail(value) ? 'text-brand' : 'text-gray-400'}
            `} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <LockIcon className="w-4 h-4" />
            <span>Your email is secure and won't be shared</span>
          </p>
        </div>
      </div>
    ),
    validate: value => {
      if (!value) return 'Please enter your email address';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;
    }
  },
  // Continuing setupSteps...
  mobile: {
    title: "What's your mobile number?",
    description: "For important updates and reminders.",
    icon: Phone,
    render: ({ value, onChange }) => (
      <div className="space-y-4">
        <div className="relative">
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={value || ''}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              if (formatted?.length <= 12) {
                onChange(formatted);
              }
            }}
            className="ios-input"
            maxLength={12}
            autoComplete="off"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <LockIcon className="w-4 h-4" />
          <span>Your number is secure and won't be shared</span>
        </p>
      </div>
    ),
    validate: value => {
      if (!value) return 'Please enter your mobile number';
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) return 'Please enter a valid 10-digit mobile number';
      return null;
    }
  },
  date_of_birth: {
    title: "When's your birthday?",
    description: "This helps us personalize your experience.",
    icon: Calendar,
    render: DateSelector,
    validate: value => {
      if (!value) return 'Please select your date of birth';
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 16) return 'You must be at least 16 years old';
      if (age > 100) return 'Please enter a valid date of birth';
      return null;
    }
  },
  gender: {
    title: "What's your gender?",
    description: "This helps us calculate your needs accurately.",
    icon: User,
    render: ({ value, onChange }) => (
      <div className="space-y-3">
        {['Male', 'Female'].map((option) => (
          <OptionButton
            key={option}
            selected={value === option}
            onClick={() => onChange(option)}
            icon={User}
          >
            <span>{option}</span>
          </OptionButton>
        ))}
      </div>
    ),
    validate: value => !value ? 'Please select your gender' : null
  },
  height: {
    title: "How tall are you?",
    description: "We'll use this to calculate your ideal ranges.",
    icon: Ruler,
    render: ({ value, onChange, formData, setFormData }) => (
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          {[
            { label: 'cm', unit: 'cm' },
            { label: 'ft/in', unit: 'ft' }
          ].map(({ label, unit }) => (
            <button
              key={unit}
              onClick={() => setFormData(prev => ({ ...prev, heightUnit: unit }))}
              className={`
                flex-1 px-4 py-2 rounded-xl transition-all duration-100
                ${formData.heightUnit === unit 
                  ? 'bg-brand text-white' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        
        {formData.heightUnit === 'ft' ? (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              value={formData.feet}
              onChange={(value) => {
                const inches = formData.inches || 0;
                const cm = Math.round((value * 30.48) + (inches * 2.54));
                setFormData(prev => ({ ...prev, feet: value, height: cm }));
              }}
              unit="ft"
              placeholder="Feet"
              min={4}
              max={8}
            />
            <NumberInput
              value={formData.inches}
              onChange={(value) => {
                const feet = formData.feet || 0;
                const cm = Math.round((feet * 30.48) + (value * 2.54));
                setFormData(prev => ({ ...prev, inches: value, height: cm }));
              }}
              unit="in"
              placeholder="Inches"
              min={0}
              max={11}
            />
          </div>
        ) : (
          <NumberInput
            value={value}
            onChange={onChange}
            unit="cm"
            placeholder="Height"
            min={100}
            max={250}
          />
        )}
      </div>
    ),
    validate: value => {
      if (!value) return 'Please enter your height';
      if (value < 100 || value > 250) return 'Please enter a valid height';
      return null;
    }
  },
  weight_log: {
    title: "What's your current weight?",
    description: "This helps us track your progress.",
    icon: Weight,
    shouldShow: (clientData) => {
      return !clientData?.client?.weight_log?.length;
    },
    render: ({ value, onChange, formData, setFormData }) => (
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          {[
            { label: 'kg', unit: 'kg' },
            { label: 'lb', unit: 'lb' }
          ].map(({ label, unit }) => (
            <button
              key={unit}
              onClick={() => setFormData(prev => ({ ...prev, weightUnit: unit }))}
              className={`
                flex-1 px-4 py-2 rounded-xl transition-all duration-100
                ${formData.weightUnit === unit 
                  ? 'bg-brand text-white' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        
        <NumberInput
          value={formData.weightUnit === 'lb' ? formData.weightLb : value}
          onChange={(val) => {
            if (formData.weightUnit === 'lb') {
              const kg = Math.round(val * 0.453592);
              setFormData(prev => ({ ...prev, weightLb: val, weight: kg }));
            } else {
              onChange(val);
            }
          }}
          unit={formData.weightUnit}
          placeholder="Weight"
          min={formData.weightUnit === 'lb' ? 88 : 40}
          max={formData.weightUnit === 'lb' ? 660 : 300}
        />
      </div>
    ),
    validate: value => {
      if (!value) return 'Please enter your weight';
      if (value < 40 || value > 300) return 'Please enter a valid weight';
      return null;
    }
  },
  weight_goal: {
    title: "What's your target weight?",
    description: "Let's set a realistic goal together.",
    icon: Target,
    render: ({ value, onChange, formData, setFormData }) => (
      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          {[
            { label: 'kg', unit: 'kg' },
            { label: 'lb', unit: 'lb' }
          ].map(({ label, unit }) => (
            <button
              key={unit}
              onClick={() => setFormData(prev => ({ ...prev, weightUnit: unit }))}
              className={`
                flex-1 px-4 py-2 rounded-xl transition-all duration-100
                ${formData.weightUnit === unit 
                  ? 'bg-brand text-white' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        
        <NumberInput
          value={formData.weightUnit === 'lb' ? formData.goalWeightLb : value}
          onChange={(val) => {
            if (formData.weightUnit === 'lb') {
              const kg = Math.round(val * 0.453592);
              setFormData(prev => ({ ...prev, goalWeightLb: val, weight_goal: kg }));
            } else {
              onChange(val);
            }
          }}
          unit={formData.weightUnit}
          placeholder="Target Weight"
          min={formData.weightUnit === 'lb' ? 88 : 40}
          max={formData.weightUnit === 'lb' ? 660 : 300}
        />
      </div>
    ),
    validate: (value, formData) => {
      if (!value) return 'Please enter your target weight';
      if (value < 40 || value > 300) return 'Please enter a valid weight';
      const currentWeight = formData.weight;
      if (Math.abs(currentWeight - value) > 100) {
        return 'Please set a more realistic target weight';
      }
      return null;
    }
  },
  // Continuing setupSteps...
  workout_preference: {
    title: "Where do you prefer to workout?",
    description: "We'll customize your workout plan accordingly.",
    icon: Dumbbell,
    render: ({ value, onChange }) => (
      <div className="space-y-3">
        {[
          { value: 'Gym', desc: 'Access to equipment' },
          { value: 'Home', desc: 'Minimal equipment needed' },
          { value: 'Hybrid', desc: 'Mix of gym and home workouts' }
        ].map((option) => (
          <OptionButton
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={Dumbbell}
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.value}</span>
              <span className="text-sm opacity-70">{option.desc}</span>
            </div>
          </OptionButton>
        ))}
      </div>
    ),
    validate: value => !value ? 'Please select your workout preference' : null
  },
  workout_split: {
    title: "How many days can you commit to working out?",
    description: "Be realistic - consistency is key!",
    icon: Clock,
    render: ({ value, onChange }) => (
      <div className="space-y-3">
        {[
          { value: '3-Day Split', desc: '3 workouts per week' },
          { value: '4-Day Split', desc: '4 workouts per week' },
          { value: '5-Day Split', desc: '5 workouts per week' },
          { value: '6-Day Split', desc: '6 workouts per week' }
        ].map((option) => (
          <OptionButton
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={Clock}
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.value}</span>
              <span className="text-sm opacity-70">{option.desc}</span>
            </div>
          </OptionButton>
        ))}
      </div>
    ),
    validate: value => !value ? 'Please select your workout schedule' : null
  },
  goal: {
    title: "What's your primary fitness goal?",
    description: "This will help us tailor your program.",
    icon: Goal,
    render: ({ value, onChange }) => (
      <div className="space-y-3">
        {[
          { value: 'Weight Loss', desc: 'Reduce body fat' },
          { value: 'Weight Gain', desc: 'Build mass' },
          { value: 'Muscle Building', desc: 'Gain strength and muscle' },
          { value: 'General Fitness', desc: 'Improve overall health' }
        ].map((option) => (
          <OptionButton
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={Goal}
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.value}</span>
              <span className="text-sm opacity-70">{option.desc}</span>
            </div>
          </OptionButton>
        ))}
      </div>
    ),
    validate: value => !value ? 'Please select your fitness goal' : null
  },
  meal_split: {
    title: "How many meals do you prefer per day?",
    description: "We'll structure your meal plan accordingly.",
    icon: Apple,
    render: ({ value, onChange }) => (
      <div className="space-y-3">
        {[
          { value: '3-Meal Split', desc: 'Traditional breakfast, lunch, dinner' },
          { value: '4-Meal Split', desc: 'Includes afternoon snack' },
          { value: '5-Meal Split', desc: 'Multiple smaller meals' },
          { value: '6-Meal Split', desc: 'Frequent small meals' }
        ].map((option) => (
          <OptionButton
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={Apple}
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.value}</span>
              <span className="text-sm opacity-70">{option.desc}</span>
            </div>
          </OptionButton>
        ))}
      </div>
    ),
    validate: value => !value ? 'Please select your meal frequency' : null
  }
};

const SetupWizard = () => {
  const { clientData, updateClientData } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Return early if no client data
  if (!clientData?.client) {
    return null;
  }
  
  // Only include steps for missing or invalid data
  const requiredSteps = useMemo(() => {
    return Object.entries(setupSteps).filter(([field, config]) => {
      if (config.shouldShow) {
        return config.shouldShow(clientData);
      }
      return !clientData.client[field];
    });
  }, [clientData]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => ({
    ...clientData.client,
    weightUnit: 'kg',
    heightUnit: 'cm'
  }));

  // Handle redirection when no steps are required
  useEffect(() => {
    if (requiredSteps.length === 0) {
      navigate('/', { replace: true });
    }
  }, [requiredSteps.length, navigate]);

  // Return null if no steps required (after useEffect)
  if (requiredSteps.length === 0) {
    return null;
  }

  const updateField = async (field, value) => {
    try {
      const clientId = clientData.client.name;
      const response = await fetch(
        `/api/v2/method/personal_trainer.custom_methods.update_client_doc?client_id=${clientId}&field=${field}&value=${value}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update');
      }
      
      // Update local client data
      updateClientData({
        ...clientData,
        client: {
          ...clientData.client,
          [field]: value
        }
      });
      return true;
    } catch (error) {
      console.error('Update error:', error);
      return false;
    }
  };

  const handleNext = async () => {
    const currentStep = requiredSteps[currentStepIndex];
    if (!currentStep) return;
    
    const [field, stepConfig] = currentStep;
    const value = formData[field];
    const validationError = stepConfig.validate?.(value, formData);

    if (validationError) {
      addToast(validationError, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateField(field, value);
      if (!success) throw new Error('Update failed');

      if (currentStepIndex < requiredSteps.length - 1) {
        setDirection('forward');
        setCurrentStepIndex(prev => prev + 1);
      } else {
        addToast('Setup completed! Welcome aboard! 🎉', 'success');
        navigate('/', { replace: true });
      }
    } catch (error) {
      addToast('Failed to update data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setDirection('backward');
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const [field, stepConfig] = requiredSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / requiredSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-brand/5 to-brand/10 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="h-full flex flex-col pt-6">
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Step {currentStepIndex + 1} of {requiredSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <div className="flex-1 px-6 overflow-y-auto">
          <div className={`
            space-y-6 transition-all duration-300
            ${direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right'}
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-brand/10 text-brand">
                <stepConfig.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold dark:text-white">
                {stepConfig.title}
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400">
              {stepConfig.description}
            </p>

            <div className="max-w-md mx-auto">
              {stepConfig.render({
                value: formData[field],
                onChange: (value) => setFormData(prev => ({
                  ...prev,
                  [field]: value
                })),
                formData,
                setFormData
              })}
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto">
          <div className="flex justify-between space-x-4">
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="ios-button-secondary flex items-center justify-center space-x-2 w-1/3"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`ios-button-primary flex items-center justify-center space-x-2 ${
                currentStepIndex === 0 ? 'w-full' : 'w-2/3'
              }`}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>
                    {currentStepIndex === requiredSteps.length - 1 ? 'Complete Setup' : 'Continue'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;