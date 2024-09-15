import { FC, Fragment } from 'react';
import 'react-quill/dist/quill.snow.css';
import 'quill-table-ui/dist/index.css';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material';
import PropTypes from 'prop-types';


interface QuillEditorProps {
  readOnly?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
  value?: string;
}


const ReactQuill = dynamic( () => import('react-quill').then((quill)=>{

  const BlotFormatter = require('quill-blot-formatter');
  quill.default.Quill.register('modules/blotFormatter', BlotFormatter.default);

  const quillTableUI = require('quill-table-ui');
  console.log(quillTableUI);
  quill.default.Quill.register({ 'modules/tableUI' : quillTableUI.default}, true);

  const quillTable = require('quill-table');
  quill.default.Quill.register(quillTable.TableCell);
  quill.default.Quill.register(quillTable.TableRow);
  quill.default.Quill.register(quillTable.Table);
  quill.default.Quill.register(quillTable.Contain);
  quill.default.Quill.register('modules/table', quillTable.TableModule);

  return quill;
}), {ssr : false});

export const QuillEditor: FC<QuillEditorProps> = (props) => {
  const { readOnly=false, sx, onChange, placeholder, value, ...other } = props;

  const QuillEditorRoot = styled('div')(
    ({ theme }) => ({
      border: 1,
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      '& .quill': {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden'
      },
      '& .ql-snow.ql-toolbar': {
        display : readOnly ? 'none' : 'block',
        borderColor: theme.palette.divider,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        '& .ql-picker-label:hover': {
          color: theme.palette.primary.main
        },
        '& .ql-picker-label.ql-active': {
          color: theme.palette.primary.main
        },
        '& .ql-picker-item:hover': {
          color: theme.palette.primary.main
        },
        '& .ql-picker-item.ql-selected': {
          color: theme.palette.primary.main
        },
        '& button:hover': {
          color: theme.palette.primary.main,
          '& .ql-stroke': {
            stroke: theme.palette.primary.main
          }
        },
        '& button:focus': {
          color: theme.palette.primary.main,
          '& .ql-stroke': {
            stroke: theme.palette.primary.main
          }
        },
        '& button.ql-active': {
          '& .ql-stroke': {
            stroke: theme.palette.primary.main
          }
        },
        '& .ql-stroke': {
          stroke: theme.palette.text.primary
        },
        '& .ql-picker': {
          color: theme.palette.text.primary
        },
        '& .ql-table.ql-picker.ql-expanded' : {
          '& .ql-picker-options': {
            width : '160px'
          }
        }, 
        '& .ql-picker-options': {
          backgroundColor: theme.palette.background.paper,
          border: 'none',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[10],
          padding: theme.spacing(2)
        }
      },
      '& .ql-snow.ql-container': {
        borderBottom: 'none',
        borderColor: theme.palette.divider,
        borderLeft: 'none',
        borderRight: 'none',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        overflow: 'hidden',
        '& .ql-editor': {
          color: theme.palette.text.primary,
          flex: 1,
          fontFamily: theme.typography.body1.fontFamily,
          fontSize: theme.typography.body1.fontSize,
          height: 'auto',
          overflowY: 'auto',
          padding: theme.spacing(2),
          '&.ql-blank::before': {
            color: theme.palette.text.secondary,
            fontStyle: 'normal',
            left: theme.spacing(2)
          }
        }
      }
    })
  );

  const maxRows = 4;
  const maxCols = 4;

  const tableOptions = [];
  for (let r = 1; r <= maxRows; r++) {
    for (let c = 1; c <= maxCols; c++) {
      tableOptions.push("newtable_" + r + "_" + c);
    }
  }

  return (
    <Fragment>
        <QuillEditorRoot
          sx={sx}
          {...other}
          data-text-editor="editor"
        >
          <ReactQuill
            readOnly={readOnly}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'font': [] }],
                  [{ 'align': [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
                  [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ['formula',{'table' : tableOptions},'code-block','image', 'video'],
                ],
              },
              table: true,
              tableUI: {},
              blotFormatter: {}
            }}
            value={value}
            bounds={`[data-text-editor="editor"]`}
          />
        </QuillEditorRoot>
    </Fragment>
  );
};

QuillEditor.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
  value: PropTypes.string
};
