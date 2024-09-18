import { FC, Fragment, useEffect, useRef, useState } from 'react';
import type { SxProps } from '@mui/system';
import { Box, type Theme } from '@mui/material';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import useTransition from 'next-translate/useTranslation';


interface MyjEditorProps {
  readOnly?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
  value?: string;
}

export const MyjEditor: FC<MyjEditorProps> = (props) => {
  const { readOnly=false, sx, onChange=()=>{}, placeholder, value, ...other } = props;
  const { t, lang } = useTransition('common');
  const [language, setLanguage] = useState<'ko_KR'| 'en'>(lang === 'ko' ? 'ko_KR' : 'en');
  const editorRef = useRef<any>(null);

  useEffect(()=>{
    setLanguage(lang === 'ko' ? 'ko_KR' : 'en');
  },[lang])

  return (
    <Fragment>
      <Box sx={{'& .tox-tinymce' : {minHeight: '70vh'}, 
                '& .tox-statusbar' : {display: readOnly ? 'none !important' : 'flex'},
                '& .tox-editor-header' : {display: readOnly ? 'none !important' : 'grid'},
                '& .tox .tox-edit-area::before': {border: '2px solid', borderColor: 'primary.main'}}}>
          <Editor
          key={'editor' + language}
          apiKey='toxwj73m3g4bweyr7izlsw8k8fpnf779l7hmwkakf93ncony'
          onInit={(_evt, editor) => editorRef.current = editor}
          initialValue={value}
          init={{
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
            toolbar: !readOnly ?
            'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl' : '',
            menubar: !readOnly ? 'file edit view insert format tools table help' : '',
            tinycomments_mode: 'embedded',
            image_caption: true,
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            language: language,  // 한국어 설정
            language_url: lang === 'ko' ? '/static/tinymce/langs/ko_KR.js' : ''
          }}

          onEditorChange={(content)=>onChange(content)}
          disabled={readOnly}
        />
      </Box>
    </Fragment>
  );
};

MyjEditor.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
  value: PropTypes.string
};
