'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export const OptimizedImage = React.memo(
  ({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    quality = 85,
    placeholder = 'empty',
    blurDataURL,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    fill = false,
    style,
    ...props
  }: OptimizedImageProps) => {
    // Generate a simple blur placeholder if none provided
    const defaultBlurDataURL = React.useMemo(() => {
      if (placeholder === 'blur' && !blurDataURL) {
        return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      }
      return blurDataURL;
    }, [placeholder, blurDataURL]);

    const imageProps = {
      src,
      alt,
      className: cn('transition-opacity duration-300', className),
      priority,
      quality,
      placeholder,
      ...(defaultBlurDataURL && { blurDataURL: defaultBlurDataURL }),
      sizes,
      style,
      ...props,
    };

    if (fill) {
      return <Image {...imageProps} fill alt={alt} />;
    }

    if (!width || !height) {
      console.warn('OptimizedImage: width and height are required when fill is false');
      return null;
    }

    return <Image {...imageProps} width={width} height={height} alt={alt} />;
  }
);

OptimizedImage.displayName = 'OptimizedImage';

// Hero image component with optimized loading
export const HeroImage = React.memo(
  ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority
      quality={90}
      placeholder="blur"
      className={className}
      sizes="100vw"
    />
  )
);

HeroImage.displayName = 'HeroImage';

// Thumbnail component for cards and lists
export const Thumbnail = React.memo(
  ({
    src,
    alt,
    size = 'md',
    className,
  }: {
    src: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }) => {
    const sizeMap = {
      sm: { width: 64, height: 64 },
      md: { width: 128, height: 128 },
      lg: { width: 256, height: 256 },
    };

    const dimensions = sizeMap[size];

    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        quality={75}
        placeholder="blur"
        className={cn('rounded-lg', className)}
        sizes={`${dimensions.width}px`}
      />
    );
  }
);

Thumbnail.displayName = 'Thumbnail';
