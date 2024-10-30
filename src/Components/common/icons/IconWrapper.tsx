import {CommonProps} from "../../../@types/common.dto.ts";

const IconWrapper = ({ children }: CommonProps) => {
    return <div className="flex justify-center items-center">{children}</div>
}

export default IconWrapper
