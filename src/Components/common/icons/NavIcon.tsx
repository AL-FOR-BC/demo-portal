import type { ElementType, ComponentPropsWithRef } from 'react'
import navigationIcon from "../../../configs/navigation-icon.config.tsx";

type NavBarIconProps = {
    icon?: string

}
export const Icon = <T extends ElementType>({
    component,
    ...props
}: {
    header: T
} & ComponentPropsWithRef<T>) => {
    const Component = component
    return <Component {...props} />
}

const NavBarIcon = ({ icon }: NavBarIconProps) => {
    if (typeof icon !== 'string' && !icon) {
        return <></>
    }

    return (
        <span className='me-2'>
            {navigationIcon[icon]}
        </span>
    )
}

export default NavBarIcon
