import React from 'react';
import classNames from 'classnames';

import styles from './RichTextToolbar.module.scss';
import RichTextToolbarButton from './RichTextToolbarButton';
import RichTextToolbarLinkButton from './RichTextToolbarLinkButton';
import { RichTextInputAreaContext } from '../RichTextInputAreaContext';
import EditorUtilities from '../EditorUtilities';
import {
  inlineStyleTypes,
  blockTypes,
  entityTypes,
} from '../RichTextInputAreaTypes';
// import TextAreaBold from '../../new-icons/system/TextAreaBold';
// import TextAreaItalic from '../../new-icons/system/TextAreaItalic';
// import TextAreaUnderline from '../../new-icons/system/TextAreaUnderline';
// import TextAreaLink from '../../new-icons/system/TextAreaLink';
// import TextAreaBulletList from '../../new-icons/system/TextAreaBulletList';
// import TextAreaNumberedList from '../../new-icons/system/TextAreaNumberedList';

const renderButton = (
  index,
  { type, iconComponent: Icon, iconName, isDisabled, isActive, ...restProps },
) => (
  <RichTextToolbarButton
    key={`${index}-${type}`}
    dataHook={`richtextarea-button-${type.toLowerCase()}`}
    isDisabled={isDisabled}
    isActive={!isDisabled && isActive()}
    {...restProps}
  >
    {/*
    <Icon />
    */}
    <i className={iconName} />
  </RichTextToolbarButton>
);

const renderLinkButton = (
  index,
  { type, iconComponent: Icon, iconName, isDisabled, isActive, ...restProps },
) => (
  <RichTextToolbarLinkButton
    key={`${index}-${type}`}
    dataHook={`richtextarea-button-${type.toLowerCase()}`}
    isDisabled={isDisabled}
    isActive={!isDisabled && isActive()}
    {...restProps}
  >
    {/*
    <Icon />
    */}
    <i className={iconName} />
  </RichTextToolbarLinkButton>
);

const RichTextToolbar = ({
  dataHook,
  className,
  isDisabled,
  editorState,
  onBold,
  onItalic,
  onUnderline,
  onLink,
  onBulletedList,
  onNumberedList,
}) => {
  return (
    <RichTextInputAreaContext.Consumer>
      {({ texts }) => {
        const buttons = [
          {
            type: inlineStyleTypes.bold,
            // iconComponent: TextAreaBold,
            iconName: 'fas fa-bold',
            render: (index, buttonProps) => renderButton(index, buttonProps),
            isDisabled,
            isActive: () =>
              EditorUtilities.isEditorFocused(editorState) &&
              EditorUtilities.hasStyle(editorState, inlineStyleTypes.bold),
            tooltipText: texts.toolbarButtons.boldButtonLabel,
            onClick: () =>
              onBold(
                EditorUtilities.toggleStyle(editorState, inlineStyleTypes.bold),
              ),
          },
          {
            type: inlineStyleTypes.italic,
            // iconComponent: TextAreaItalic,
            iconName: 'fas fa-italic',
            render: (index, buttonProps) => renderButton(index, buttonProps),
            isDisabled,
            isActive: () =>
              EditorUtilities.isEditorFocused(editorState) &&
              EditorUtilities.hasStyle(editorState, inlineStyleTypes.italic),
            tooltipText: texts.toolbarButtons.italicButtonLabel,
            onClick: () =>
              onItalic(
                EditorUtilities.toggleStyle(
                  editorState,
                  inlineStyleTypes.italic,
                ),
              ),
          },
          {
            type: inlineStyleTypes.underline,
            // iconComponent: TextAreaUnderline,
            iconName: 'fas fa-underline',
            render: (index, buttonProps) => renderButton(index, buttonProps),
            isDisabled,
            isActive: () =>
              EditorUtilities.isEditorFocused(editorState) &&
              EditorUtilities.hasStyle(editorState, inlineStyleTypes.underline),
            tooltipText: texts.toolbarButtons.underlineButtonLabel,
            onClick: () =>
              onUnderline(
                EditorUtilities.toggleStyle(
                  editorState,
                  inlineStyleTypes.underline,
                ),
              ),
          },
          // {
          //   type: entityTypes.link,
          //   // iconComponent: TextAreaLink,
          //   iconName: 'fas fa-link',
          //   render: (index, buttonProps) =>
          //     renderLinkButton(index, buttonProps),
          //   isDisabled,
          //   isActive: () =>
          //     EditorUtilities.isEditorFocused(editorState) &&
          //     EditorUtilities.hasEntity(editorState, entityTypes.link),
          //   tooltipText: texts.toolbarButtons.linkButtonLabel,
          //   // The data which is passed and being used within the insertion form
          //   data: {
          //     selectedText: EditorUtilities.getSelectedText(editorState),
          //     hasRemovableEntityInSelection: EditorUtilities.hasRemovableEntityInSelection(
          //       editorState,
          //     ),
          //   },
          //   onSubmit: (event, linkData) => {
          //     onLink(EditorUtilities.toggleLink(editorState, linkData));
          //   },
          //   onRemove: () => {
          //     onLink(EditorUtilities.toggleLink(editorState));
          //   },
          // },
          {
            type: blockTypes.bulletedList,
            // iconComponent: TextAreaBulletList,
            iconName: 'fas fa-list-ul',
            render: (index, buttonProps) => renderButton(index, buttonProps),
            isDisabled,
            isActive: () =>
              EditorUtilities.isEditorFocused(editorState) &&
              EditorUtilities.hasBlockType(
                editorState,
                blockTypes.bulletedList,
              ),
            tooltipText: texts.toolbarButtons.bulletedListButtonLabel,
            onClick: () =>
              onBulletedList(
                EditorUtilities.toggleBlockType(
                  editorState,
                  blockTypes.bulletedList,
                ),
              ),
          },
          {
            type: blockTypes.numberedList,
            // iconComponent: TextAreaNumberedList,
            iconName: 'fas fa-list-ol',
            render: (index, buttonProps) => renderButton(index, buttonProps),
            isDisabled,
            isActive: () =>
              EditorUtilities.isEditorFocused(editorState) &&
              EditorUtilities.hasBlockType(
                editorState,
                blockTypes.numberedList,
              ),
            tooltipText: texts.toolbarButtons.numberedListButtonLabel,
            onClick: () =>
              onNumberedList(
                EditorUtilities.toggleBlockType(
                  editorState,
                  blockTypes.numberedList,
                ),
              ),
          },
        ];

        return (
          <div
            data-hook={dataHook}
            className={classNames(className, styles.root)}
          >
            {buttons.map(({ render, ...props }, index) => render(index, props))}
          </div>
        );
      }}
    </RichTextInputAreaContext.Consumer>
  );
};

export default RichTextToolbar;
