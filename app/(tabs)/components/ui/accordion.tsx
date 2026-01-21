import { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { ChevronDown } from "lucide-react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function Accordion({ children }) {
  return <View>{children}</View>;
}

export function AccordionItem({ children }) {
  return <View className="border-b border-gray-300">{children}</View>;
}

export function AccordionTrigger({ title, children }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggle} className="flex flex-row justify-between py-4">
        <Text className="text-base font-medium">{title}</Text>
        <ChevronDown
          size={18}
          style={{
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {open && <View className="pb-4">{children}</View>}
    </View>
  );
}

export function AccordionContent({ children }) {
  return <View>{children}</View>;
}
