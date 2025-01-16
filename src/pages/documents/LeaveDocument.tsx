import { useEffect } from "react";
import { useLeaveDocument } from "@/hooks/documents/useLeaveDocument";
import HeaderMui from "../../Components/ui/Header/HeaderMui";

export const LeaveDocument = () => {
  const { state, populateDocument } = useLeaveDocument();

  useEffect(() => {
    populateDocument();
  }, []);

  return <HeaderMui title="Leave Document"
  
    ,
  
  
  />;
};
