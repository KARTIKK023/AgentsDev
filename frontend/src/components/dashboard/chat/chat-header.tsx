import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "@/redux/conversationSlice";
import {X} from 'lucide-react'
import { Separator } from "@/components/ui/separator";

export function ChatHeader(){
    const dispatch = useDispatch();
    const {selectedConversation} = useSelector((state: RootState) => state.conversations);
    return (
              <header className="flex flex-col">
        <div className="flex flex-item justify-between gap-4 p-2">
          <div>{selectedConversation?.title}</div>
          <div>
            <div className="cursor-pointer" onClick={()=>{dispatch(setSelectedConversation(null))}}>
              <X className="size-5" />
            </div>
          </div>
        </div>
      <Separator />
      </header>
    )
}