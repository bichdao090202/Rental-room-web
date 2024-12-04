import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box,Button,Divider,FormControl,IconButton,Menu,MenuItem,Select,TextField,Tooltip} from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, CodeOutlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify, FormatListBulleted, FormatListNumbered, Link, FontDownload, FormatSize, Margin, } from '@mui/icons-material';

interface FormattedTextEditorProps {
    value?: string; 
    onChange: (content: string) => void; 
    placeholder?: string;
    fullWidth?: boolean; 
}

const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
    value,
    onChange,
    placeholder = '',
    fullWidth = true,
}) => {
    const [editorState, setEditorState] = useState<EditorState>(() => {
        if (value) {
            try {
                const contentState: ContentState = convertFromRaw(JSON.parse(value));
                return EditorState.createWithContent(contentState);
            } catch {
                return EditorState.createEmpty();
            }
        }
        return EditorState.createEmpty();
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [fontSize, setFontSize] = useState('16px');
    const [fontFamily, setFontFamily] = useState('Arial');

    const handleEditorChange = (newEditorState: EditorState): void => {
        setEditorState(newEditorState);
        const contentState = newEditorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));
        onChange(rawContent);
    };

    const toggleInlineStyle = (style: string): void => {
        handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleJustify = (): void => {
        handleEditorChange(RichUtils.toggleInlineStyle(editorState, 'JUSTIFY'));
    };

    const toggleBlockType = (blockType: string): void => {
        handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    };

    const toggleListType = (listType: string): void => {
        handleEditorChange(RichUtils.toggleBlockType(editorState, listType));
    };

    const applyFontSize = (): void => {
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('FONT_SIZE', 'MUTABLE', { size: fontSize });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyInlineStyle(
            contentState,
            selection,
            `FONT_SIZE_${fontSize}`
        );
        handleEditorChange(EditorState.push(editorState, newContentState, 'change-inline-style'));
    };

    const applyLink = (): void => {
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: linkUrl });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newContentState = Modifier.applyEntity(contentState, selection, entityKey);
            handleEditorChange(EditorState.push(editorState, newContentState, 'apply-entity'));
        }
        setAnchorEl(null);
    };


    return (
        <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 1, padding: 1, width: fullWidth ? '100%' : 'auto', }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 1,
                }}
            >
                <Tooltip title="Font chữ">
                    <FormControl size="small" sx={{width:'200px', mr:"10px"}}>
                        <Select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                        >
                            <MenuItem value="Arial">Arial</MenuItem>
                            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                            <MenuItem value="Verdana">Verdana</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>

                <Tooltip title="Cỡ chữ">
                    <FormControl size="small">
                        <Select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                        >
                            <MenuItem value="12px">12px</MenuItem>
                            <MenuItem value="16px">16px</MenuItem>
                            <MenuItem value="20px">20px</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>

                <Tooltip title="In đậm">
                    <IconButton
                        size="small"
                        onClick={() => toggleInlineStyle('BOLD')}
                        color={editorState.getCurrentInlineStyle().has('BOLD') ? 'primary' : 'default'}
                    >
                        <FormatBold />
                    </IconButton>
                </Tooltip>
                <Tooltip title="In nghiêng">
                    <IconButton
                        size="small"
                        onClick={() => toggleInlineStyle('ITALIC')}
                        color={editorState.getCurrentInlineStyle().has('ITALIC') ? 'primary' : 'default'}
                    >
                        <FormatItalic />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Gạch chân">
                    <IconButton
                        size="small"
                        onClick={() => toggleInlineStyle('UNDERLINE')}
                        color={editorState.getCurrentInlineStyle().has('UNDERLINE') ? 'primary' : 'default'}
                    >
                        <FormatUnderlined />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Liên kết">
                    <IconButton
                        size="small"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <Link />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Mã code">
                    <IconButton
                        size="small"
                        onClick={() => toggleInlineStyle('CODE')}
                        color={editorState.getCurrentInlineStyle().has('CODE') ? 'primary' : 'default'}
                    >
                        <CodeOutlined />
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <Box sx={{ padding: 2 }}>
                        <TextField
                            label="URL"
                            value={linkUrl}
                            onChange={(e: any) => setLinkUrl(e.target.value)}
                            fullWidth
                        />
                        <Button onClick={applyLink}>Thêm liên kết</Button>
                    </Box>
                </Menu>

                <Tooltip title="Căn trái">
                    <IconButton size="small" onClick={() => toggleBlockType('left')}>
                        <FormatAlignLeft />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Căn giữa">
                    <IconButton size="small" onClick={() => toggleBlockType('center')}>
                        <FormatAlignCenter />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Căn phải">
                    <IconButton size="small" onClick={() => toggleBlockType('right')}>
                        <FormatAlignRight />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Căn đều">
                    <IconButton
                        size="small"
                        onClick={() => toggleJustify()}
                        color={editorState.getCurrentInlineStyle().has('UNDERLINE') ? 'primary' : 'default'}
                    >
                        <FormatAlignJustify />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Danh sách không thứ tự">
                    <IconButton size="small" onClick={() => toggleListType('unordered-list-item')}>
                        <FormatListBulleted />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Danh sách có thứ tự">
                    <IconButton size="small" onClick={() => toggleListType('ordered-list-item')}>
                        <FormatListNumbered />
                    </IconButton>
                </Tooltip>

            </Box>
            
            <Divider sx={{marginBottom:'10px'}} />

            <Editor
                editorState={editorState}
                onChange={handleEditorChange}
                placeholder={placeholder}
                customStyleMap={{
                    'CODE': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        fontFamily: '"Inconsolata", "Menlo", monospace',
                        padding: '2px',
                    },
                    'JUSTIFY': {
                        textAlign: 'justify',
                    },
                    FONT_SIZE_12px: { fontSize: '12px' },
                    FONT_SIZE_16px: { fontSize: '16px' },
                    FONT_SIZE_20px: { fontSize: '20px' },
                }}
            />
        </Box>
    );
};

export default FormattedTextEditor;
