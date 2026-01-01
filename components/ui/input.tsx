import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { cn } from "../../lib/utils"; // Pastikan path utils benar

interface InputProps extends TextInputProps {
  className?: string;
  isInvalid?: boolean;
}

function Input({ className, isInvalid, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View className="w-full">
      <TextInput
        data-slot="input"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#717182" // Sesuai --muted-foreground
        style={{ textAlignVertical: props.multiline ? 'top' : 'center' }}
        className={cn(
          // Base Styles (Sesuai global.css)
          "h-12 w-full rounded-xl border-2 px-4 text-base text-foreground bg-[#f3f3f5]", 
          "border-transparent", // Default border menggunakan background agar terlihat clean
          
          // State: Focused (Sesuai ring/ring-50)
          isFocused && "border-primary/50 bg-white", 
          
          // State: Invalid (Sesuai destructive)
          isInvalid && "border-destructive bg-destructive/5",
          
          // State: Disabled
          props.editable === false && "opacity-50",
          
          className
        )}
        {...props}
      />
    </View>
  );
}

export { Input };