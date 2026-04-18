// Web: Modal-based bottom sheet that mirrors the @gorhom/bottom-sheet API
// used in this project (expand, close, BottomSheetScrollView).
import type { ReactNode } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";

export interface BottomSheetHandle {
  expand(): void;
  close(): void;
  snapToIndex(index: number): void;
}

interface BottomSheetProps {
  children: ReactNode;
  /** >= 0 means start open at mount */
  index?: number;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>((props, ref) => {
  const { children, index = -1, onClose, backgroundStyle, handleIndicatorStyle } = props;
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(600)).current;

  const animateIn = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: false,
      damping: 22,
      stiffness: 280,
    }).start();
  };

  const animateOut = (cb?: () => void) => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 230,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      cb?.();
    });
  };

  // Open immediately if index >= 0 on mount
  useEffect(() => {
    if (index >= 0) {
      translateY.setValue(600);
      setVisible(true);
      // small delay so the modal has time to mount before animating in
      setTimeout(animateIn, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expand = () => {
    translateY.setValue(600);
    setVisible(true);
    setTimeout(animateIn, 50);
  };

  const close = () => {
    animateOut(() => onClose?.());
  };

  useImperativeHandle(ref, () => ({
    expand,
    close,
    snapToIndex: (i: number) => (i >= 0 ? expand() : close()),
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />

        {/* Sheet */}
        <Animated.View style={[styles.sheet, backgroundStyle, { transform: [{ translateY }] }]}>
          <View style={[styles.handle, handleIndicatorStyle]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;

/** On web, BottomSheetScrollView is just a ScrollView */
export const BottomSheetScrollView = ScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#334155",
    alignSelf: "center",
    marginVertical: 8,
  },
});
