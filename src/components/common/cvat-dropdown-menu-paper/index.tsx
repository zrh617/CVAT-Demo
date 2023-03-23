import React from 'react';
import './index.scss';

export default function DropdownMenuPaper({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className='cvat-dropdown-menu-paper'>{children}</div>
    );
}
