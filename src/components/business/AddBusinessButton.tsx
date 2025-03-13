
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AddBusinessButtonProps extends ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

/**
 * Reusable Add Business button that can be placed in multiple locations
 */
const AddBusinessButton: React.FC<AddBusinessButtonProps> = ({
  variant = 'default',
  size = 'default',
  showIcon = true,
  className,
  ...props
}) => {
  const { t } = useLanguage();
  
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn('whitespace-nowrap', className)}
      {...props}
    >
      <Link to="/add-business" className="flex items-center gap-1">
        {showIcon && <PlusCircle className="h-4 w-4" />}
        <span>{t('business.addBusiness') || 'Add Business'}</span>
      </Link>
    </Button>
  );
};

export default AddBusinessButton;
