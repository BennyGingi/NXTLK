import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "../ui/popover";
import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (emoji: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { theme } = useTheme();
    
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
                </PopoverTrigger>
                <PopoverContent className="w-full">
                    <Picker
                        emojiSize={18}
                        data={data}
                        maxFrequentRows={4}
                        theme={theme === "dark" ? "dark" : "light"}
                        onEmojiSelect={(emoji: any) => {
                            const emojiChar = emoji.native || emoji.shortcodes || emoji.id;
                            if (emojiChar) {
                                onChange(emojiChar);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default EmojiPicker;
