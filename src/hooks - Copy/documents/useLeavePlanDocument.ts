import { useEffect } from "react";
import { leaveService } from "../../services/LeaveServices";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLeavePlanDocument = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const navigate = useNavigate();
  //   const [state, setState] = useState({});
  const deleteLeavePlan = async (systemId: string) => {
    try {
      await leaveService.deleteLeavePlan(companyId, systemId);
      toast.success("Leave plan deleted successfully");
      navigate("/leave-plans");
    } catch (error) {
      toast.error("Failed to delete leave plan");
      console.log(error);
    }
  };

  useEffect(() => {
    // leaveService.getLeavePlan(companyId, systemId);
  }, []);

  return {
    deleteLeavePlan,
  };
};
