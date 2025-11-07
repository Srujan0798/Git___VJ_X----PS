import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = 'w-5 h-5' }) => (
  <span className={`${className} text-slate-400`}>{children}</span>
);

const SvgIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        {children}
    </svg>
);

export const DatabaseIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
        </SvgIcon>
    </Icon>
);

export const TvIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v9.75c0 1.24 1.01 2.25 2.25 2.25z" />
        </SvgIcon>
    </Icon>
);

export const BarChartIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </SvgIcon>
    </Icon>
);

export const StickyNoteIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </SvgIcon>
    </Icon>
);

export const SparklesIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l-.219.872-.219-.872a1.5 1.5 0 011.027-1.712l.872-.219-.872-.219a1.5 1.5 0 01-1.027-1.712l.219-.872.219.872a1.5 1.5 0 01-1.027 1.712l-.872.219.872.219a1.5 1.5 0 011.027 1.712z" />
        </SvgIcon>
    </Icon>
);

export const ApiIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </SvgIcon>
    </Icon>
);

export const ZoomInIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
        </SvgIcon>
    </Icon>
);

export const ZoomOutIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
        </SvgIcon>
    </Icon>
);

export const FitViewIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m-11.25 6.75v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 6.75h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </SvgIcon>
    </Icon>
);

export const UndoIcon = () => (
    <Icon className="w-5 h-5">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </SvgIcon>
    </Icon>
);

export const RedoIcon = () => (
    <Icon className="w-5 h-5">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
        </SvgIcon>
    </Icon>
);


export const HelpCircleIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </SvgIcon>
    </Icon>
);

export const SettingsIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.11a12.002 12.002 0 015.093 0c.55.103 1.02.568 1.11 1.11a12.002 12.002 0 010 5.093c-.09.542-.56 1.007-1.11 1.11a12.002 12.002 0 01-5.093 0c-.55-.103-1.02-.568-1.11-1.11a12.002 12.002 0 010-5.093zM14.25 10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12s4.365 9.75 9.75 9.75z" />
        </SvgIcon>
    </Icon>
);

export const FolderOpenIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 016 7.5h1.5m9 2.25a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25h-6.75a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25m-9 0h16.5m-16.5 0a2.25 2.25 0 00-2.25 2.25v6A2.25 2.25 0 003.75 21h16.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25H3.75z" />
        </SvgIcon>
    </Icon>
);

export const WalletIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </SvgIcon>
    </Icon>
);

export const KeyIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </SvgIcon>
    </Icon>
);

export const PlusCircleIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SvgIcon>
    </Icon>
);

export const CopyIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042A2.25 2.25 0 0113.5 9h-3a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 019 4.5h3a2.25 2.25 0 012.25 2.25v.75m-6 5.25h3v3h-3v-3z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </SvgIcon>
    </Icon>
);

export const ShareIcon = () => (
    <Icon className="w-4 h-4">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" />
        </SvgIcon>
    </Icon>
);

export const TemplateIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </SvgIcon>
    </Icon>
);

export const TrashIcon = () => (
    <Icon className="w-4 h-4">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </SvgIcon>
    </Icon>
);

export const ChartBarIcon = () => (
    <Icon className="w-8 h-8">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></SvgIcon>
    </Icon>
);

export const LinkIcon = () => (
    <Icon className="w-8 h-8">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></SvgIcon>
    </Icon>
);

export const ServerStackIcon = () => (
    <Icon className="w-8 h-8">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></SvgIcon>
    </Icon>
);

export const DocumentDuplicateIcon = () => (
    <Icon className="w-8 h-8">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m9.375 2.25c.621 0 1.125.504 1.125 1.125v3.375m0 0c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-3.375m1.5 0c0-.621.504-1.125 1.125-1.125h1.5a1.125 1.125 0 011.125 1.125v3.375" /></SvgIcon>
    </Icon>
);

export const ArrowLeftIcon = () => (
    <Icon className="w-5 h-5">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></SvgIcon>
    </Icon>
);

export const SearchIcon = () => (
    <Icon className="w-5 h-5">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></SvgIcon>
    </Icon>
);

export const StarIcon = () => (
    <Icon className="w-5 h-5">
        <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></SvgIcon>
    </Icon>
);

export const MenuIcon = () => (
    <Icon className="w-6 h-6">
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-1.5 5.25h16.5" />
        </SvgIcon>
    </Icon>
);

export const HomeIcon = () => (
    <Icon>
        <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </SvgIcon>
    </Icon>
);

export const PaletteIcon = () => (
    <Icon className="w-4 h-4">
        <SvgIcon>
             <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.6c-.432.432-.432 1.132 0 1.564.432.432 1.132.432 1.564 0l3.535-3.536m-7.071 7.071a.75.75 0 0 1 1.06 0l4.95-4.95a.75.75 0 0 1 0-1.06l-4.95-4.95a.75.75 0 0 1-1.06 0a.75.75 0 0 1 0-1.06l4.95-4.95a.75.75 0 0 1 1.06 0l4.95 4.95a.75.75 0 0 1 0 1.06l-4.95 4.95a.75.75 0 0 1-1.06 0a.75.75 0 0 1 0 1.06l4.95 4.95a.75.75 0 0 1-1.06 0l-4.95-4.95" />
        </SvgIcon>
    </Icon>
);
