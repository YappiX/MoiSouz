import { ruRU } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

export const globalTheme = createTheme({
  colorSchemes: {
    dark: false,
  },
  palette: {
    mode: 'light',
    primary: { main: 'rgb(72, 128, 255)' },
    secondary: { main: 'rgb(243, 244, 248)' },
    red: { main: 'rgb(249, 60, 101)' },
    error: { main: 'rgb(249, 60, 101)' },
    gray: { main: 'rgb(194, 195, 195)' },
  },
});

export default createTheme(
  {
    ...globalTheme,
    spacing: 10,
    breakpoints: {
      values: {
        xs: 320,
        sm: 744,
        md: 980,
        lg: 1240,
        xl: 1620,
      },
    },
    typography: {
      fontFamily: ['Nunito Sans', 'sans-serif'].join(','),
      h1: {
        fontSize: '155px',
        lineHeight: '178px',
        fontWeight: '800',
        color: 'rgb(32, 34, 36)',
        '@media (max-width: 744px)': {
          fontSize: '60px !important',
          lineHeight: '72px !important',
        },
      },
      h2: {
        fontSize: '36px',
        lineHeight: '52px',
        fontWeight: '200',
        textAlign: 'center',
        color: 'rgb(32, 34, 36)',
        '@media(max-width: 744px)': {
          fontSize: '30px',
          lineHeight: '48px',
        },
      },
      h3: {
        fontSize: '22px',
        lineHeight: '30px',
        fontWeight: '800',
        color: '#000',
        '@media(max-width: 744px)': {
          fontSize: '18px',
          lineHeight: '24px',
        },
      },
      h4: {
        fontSize: '16px',
        lineHeight: '22px',
        fontWeight: '300',
        color: '#000',
        '@media(max-width: 744px)': {
          fontSize: '14.8px',
          lineHeight: '20px',
        },
      },
      body1: {
        fontSize: '16px',
        lineHeight: '22px',
        fontWeight: '300',
        color: '#000',
        '@media(max-width: 744px)': {
          fontSize: '14.8px',
          lineHeight: '20px',
        },
      },
      body2: {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: '400',
        color: '#000',
        '@media(max-width: 980px)': {
          fontSize: '12.8px',
          lineHeight: '16px',
        },
      },
    },
    components: {
      MuiTableContainer: {
        styleOverrides: {
          root: {
            '&::-webkit-scrollbar': {},
            '&::-webkit-scrollbar-track': {},
            '&::-webkit-scrollbar-thumb': {},
            '&::-webkit-scrollbar-thumb:hover': {},
          },
        },
      },
      MuiTabs: {
        styleOverrides: {},
      },
      MuiTab: {
        styleOverrides: {
          root: {},
        },
      },
      MuiFormLabel: {
        styleOverrides: {},
      },
      MuiAccordion: {
        styleOverrides: {},
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {},
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {},
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {},
          message: {},
          icon: {},
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {},
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            '& .MuiDialog-container': {
              paddingRight: '0 !important',
              height: '100vh !important',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            padding: '24px',
            '@media(max-width: 480px)': {
              '&.MuiDialog-paper': {
                margin: '0',
              },
            },

            variants: [
              {
                props: { variant: 'popover' },
                style: {
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.05)',
                  borderRadius: 10,
                  padding: 5,
                },
              },
            ],
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: '1620px',
            '@media (max-width: 980px)': {
              padding: '0 52px 0 52px',
            },
            '@media (max-width: 480px)': {
              padding: '0 16px 0 16px',
            },
          },
          maxWidthLg: {
            maxWidth: '1620px !important',
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {},
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '18px',
            fontWeight: '600',
            lineHeight: '25px',
            fontFamily: 'Nunito Sans',
            marginBottom: '15px',
            width: '100%',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: 'rgb(241, 244, 249)',
            fontSize: '18px',
            lineHeight: '25px',
            fontWeight: '600',
            fontFamily: 'Nunito Sans',
            '&.Mui-error': {
              borderColor: '#FF4949',
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            margin: 0,
            position: 'absolute',
            right: 'auto',
            left: '-16px',
            top: 'calc(100% - 2px)',
            fontSize: '13px',
            fontWeight: 600,
            padding: '4px 16px',
            whiteSpace: 'nowrap',
            '&.Mui-error': {
              color: '#FF4949',
            },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            '&.Mui-error': {},
          },
        },
      },
      MuiRadio: {
        styleOverrides: {},
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {},
          colorPrimary: {},
          colorSecondary: {},
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          paper: {
            '&:hover': {},
          },
        },
      },
      MuiMenuList: {
        styleOverrides: {
          root: {},
        },
      },
      MuiList: {
        styleOverrides: {
          root: {},
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            padding: '8px 3px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            span: {
              fontFamily: ['Nunito Sans'],
              textTransform: 'none',
              fontWeight: '600',
              boxShadow: 'none',
            },
            svg: {
              color: 'black',
            },

            '&.Mui-selected': {
              borderRadius: '6px',
              backgroundColor: globalTheme.palette.primary.main,

              span: {
                color: 'white',
              },
              svg: {
                color: 'white',
              },
            },

            '&:hover': {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,

                borderRadius: '6px',
                backgroundColor: globalTheme.palette.primary.main,
                opacity: 0.2,
              },
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whitespace: 'nowrap',
            '&.Mui-selected': {
              '&:hover': {},
            },
            '&:hover': {},
          },
        },
      },
      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          paper: {},
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {},
          select: {
            height: 'auto',
            padding: 0,
            minHeight: 0,
          },
          nativeInput: {
            display: 'none',
          },
          icon: {},
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {},
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'contained' },
                style: {
                  backgroundColor: globalTheme.palette.primary.main,
                  transition: 'opacity 0.1s ease-out',
                  width: 36,
                  height: 36,

                  '&:hover': {
                    backgroundColor: globalTheme.palette.primary.main,
                    opacity: 0.8,
                  },
                },
              },
              {
                props: { variant: 'contained-gray' },
                style: {
                  backgroundColor: globalTheme.palette.gray.main,
                  transition: 'opacity 0.1s ease-out',
                  width: 36,
                  height: 36,

                  '&:hover': {
                    backgroundColor: globalTheme.palette.gray.main,
                    opacity: 0.8,
                  },
                },
              },
              {
                props: { variant: 'contained-red' },
                style: {
                  backgroundColor: globalTheme.palette.red.main,
                  transition: 'opacity 0.1s ease-out',
                  width: 36,
                  height: 36,

                  '&:hover': {
                    backgroundColor: globalTheme.palette.red.main,
                    opacity: 0.8,
                  },
                },
              },
            ],
          },
        },
      },
      MuiAccordionActions: {
        styleOverrides: {
          root: {
            '&.Mui-expanded': {
              margin: '0',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'contained' },
                style: {
                  borderRadius: '12px',
                  backgroundColor: globalTheme.palette.primary.main,
                  padding: '7px 12px',
                  fontFamily: ['Nunito Sans'],
                  textTransform: 'none',
                  fontWeight: '600',
                  boxShadow: 'none',
                },
              },
              {
                props: { variant: 'outlined' },
                style: {
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  padding: '16px 25px',
                  fontFamily: ['Nunito Sans'],
                  textTransform: 'none',
                  fontWeight: '600',
                  boxShadow: 'none',
                  color: '#000',
                },
              },
              {
                props: { variant: 'text' },
                style: {
                  borderRadius: '12px',
                  padding: '7px 12px',
                  fontFamily: ['Nunito Sans'],
                  textTransform: 'none',
                  fontWeight: '600',
                  boxShadow: 'none',
                  color: '#000',
                },
              },
            ],
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            maxWidth: 742,
            width: '100%',
            margin: '0 auto',
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {},
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {},
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: { padding: '6px', borderRadius: '12px' },
          listbox: {},
        },
      },
    },
  },
  ruRU,
);
