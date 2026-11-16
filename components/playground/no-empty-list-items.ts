import { Extension } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

/**
 * Bullets and numbered items with nothing in them disappear as soon as the cursor
 * leaves them, and a list left with no items goes too. The item being typed in stays,
 * so "- " still starts a list.
 */
export const NoEmptyListItems = Extension.create({
  name: "noEmptyListItems",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("noEmptyListItems"),
        appendTransaction(transactions, _oldState, state) {
          if (!transactions.some((t) => t.docChanged || t.selectionSet)) return null;

          const cursor = state.selection.from;
          const empty: { from: number; to: number; onlyChild: boolean; listFrom: number; listTo: number }[] = [];

          state.doc.descendants((node: ProseMirrorNode, pos: number, parent: ProseMirrorNode | null) => {
            if (node.type.name !== "listItem") return true;
            const holdsCursor = cursor > pos && cursor < pos + node.nodeSize;
            if (!holdsCursor && node.textContent.trim() === "") {
              const $pos = state.doc.resolve(pos);
              empty.push({
                from: pos,
                to: pos + node.nodeSize,
                onlyChild: (parent?.childCount ?? 0) <= 1,
                listFrom: $pos.before(),
                listTo: $pos.after(),
              });
              return false;
            }
            return true;
          });
          if (empty.length === 0) return null;

          const tr = state.tr;
          // Last first, so earlier positions stay correct.
          for (const item of empty.reverse()) {
            if (item.onlyChild) {
              // The whole list was just this empty item: remove the list.
              if (state.doc.childCount === 1 && item.listFrom === 0) {
                tr.replaceWith(item.listFrom, item.listTo, state.schema.nodes.paragraph.create());
              } else {
                tr.delete(item.listFrom, item.listTo);
              }
            } else {
              tr.delete(item.from, item.to);
            }
          }
          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});
