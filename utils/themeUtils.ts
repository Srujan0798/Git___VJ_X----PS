export type NodeTheme = 'sky' | 'pink' | 'green' | 'amber' | 'violet' | 'slate';

export const THEMES: Record<NodeTheme, {
    borderColor: string;
    textColor: string;
    headerBg: string;
    handleColor: string;
    ringColor: string;
    shadowColor: string;
}> = {
    sky: {
        borderColor: 'border-sky-500',
        textColor: 'text-sky-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-sky-500',
        ringColor: 'hover:ring-sky-500',
        shadowColor: 'hover:shadow-sky-500/10',
    },
    pink: {
        borderColor: 'border-pink-500',
        textColor: 'text-pink-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-pink-500',
        ringColor: 'hover:ring-pink-500',
        shadowColor: 'hover:shadow-pink-500/10',
    },
    green: {
        borderColor: 'border-emerald-500',
        textColor: 'text-emerald-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-emerald-500',
        ringColor: 'hover:ring-emerald-500',
        shadowColor: 'hover:shadow-emerald-500/10',
    },
    amber: {
        borderColor: 'border-amber-500',
        textColor: 'text-amber-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-amber-500',
        ringColor: 'hover:ring-amber-500',
        shadowColor: 'hover:shadow-amber-500/10',
    },
    violet: {
        borderColor: 'border-violet-500',
        textColor: 'text-violet-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-violet-500',
        ringColor: 'hover:ring-violet-500',
        shadowColor: 'hover:shadow-violet-500/10',
    },
    slate: {
        borderColor: 'border-slate-500',
        textColor: 'text-slate-300',
        headerBg: 'bg-slate-700/50',
        handleColor: 'bg-slate-500',
        ringColor: 'hover:ring-slate-500',
        shadowColor: 'hover:shadow-slate-500/10',
    },
};

export const getThemeStyles = (themeName?: NodeTheme) => {
    return THEMES[themeName || 'slate'] || THEMES.slate;
};
