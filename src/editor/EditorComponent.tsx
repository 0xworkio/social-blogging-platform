import React, { useState, useCallback } from 'react';
import Container from '../components/Container';
import { createEditor, BaseEditor, Transforms, Editor, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import DefaultElement from './rendreres/DefaultElement';
import Heading from './rendreres/Heading';
import Blockquote from './rendreres/Blockquote';
import Unordered from './rendreres/Unordered';
import Leaf from './Leaf';
import EditorUI from './components/EditorUI';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

interface EditorProps {}

const CustomEditor = {
  isBoldMarkActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isItalicMarkActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.italic === true,
      universal: true,
    });
    return !!match;
  },

  isStrikethroughMarkActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.strikethrough === true,
      universal: true,
    });
    return !!match;
  },

  isHeadingOneBlockActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'heading-1',
    });

    return !!match;
  },

  isHeadingTwoBlockActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'heading-2',
    });

    return !!match;
  },

  isBlockquoteActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'blockquote',
    });

    return !!match;
  },

  isUnorderedActive(editor: BaseEditor & ReactEditor): boolean {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'unordered',
    });

    return !!match;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleItalicMark(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleStrikethroughMark(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isStrikethroughMarkActive(editor);
    Transforms.setNodes(
      editor,
      { strikethrough: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleHeadingOneBlock(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isHeadingOneBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'heading-1', bold: true },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleHeadingTwoBlock(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isHeadingTwoBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'heading-2' },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleBlockquoteBlock(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isBlockquoteActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'blockquote' },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleUnorderedBlock(editor: BaseEditor & ReactEditor): void {
    const isActive = CustomEditor.isUnorderedActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'unordered' },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

const initialValue: Array<CustomElement> = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing your article here...' }],
  },
];

const EditorComponent: React.FC<EditorProps> = ({}) => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement: (props: any) => JSX.Element = useCallback(
    (props: any) => {
      switch (props.element.type) {
        case 'heading-1':
          return <Heading variant="h1" {...props} />;
        case 'heading-2':
          return <Heading variant="h2" {...props} />;
        case 'blockquote':
          return <Blockquote {...props} />;
        case 'unordered':
          return <Unordered {...props} />;
        default:
          return <DefaultElement {...props} />;
      }
    },
    []
  );

  const renderLeaf: (props: any) => JSX.Element = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Container>
      <Slate editor={editor} value={initialValue}>
        <div className="my-6 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <EditorUI
            toggleHeadingOneBlock={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleHeadingOneBlock(editor);
            }}
            toggleHeadingTwoBlock={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleHeadingTwoBlock(editor);
            }}
            toggleBlockquoteBlock={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleBlockquoteBlock(editor);
            }}
            toggleUnorderedBlock={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleUnorderedBlock(editor);
            }}
            toggleBoldMark={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
            toggleItalicMark={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleItalicMark(editor);
            }}
            toggleStrikethroughMark={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              CustomEditor.toggleStrikethroughMark(editor);
            }}
          />
          <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
            <Editable
              className="py-4 min-h-[500px]"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                if (!event.ctrlKey) {
                  return;
                }
                switch (event.key) {
                  case 'b': {
                    event.preventDefault();
                    CustomEditor.toggleBoldMark(editor);
                    break;
                  }
                }
              }}
            />
          </div>
        </div>
      </Slate>
    </Container>
  );
};

export default EditorComponent;
