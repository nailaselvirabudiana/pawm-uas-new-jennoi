import type { ReactNode } from 'react';
import { Text } from 'react-native';

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export const H1 = ({ children, className = '' }: TypographyProps) => (
  <Text className={`text-2xl font-semibold leading-relaxed ${className}`.trim()}>{children}</Text>
);

export const H2 = ({ children, className = '' }: TypographyProps) => (
  <Text className={`text-xl font-semibold leading-relaxed ${className}`.trim()}>{children}</Text>
);