import {
	Plugin,
	MarkdownView,
  } from "obsidian";

  export default class Min3ditorHotkeys extends Plugin {
	onInit() {}

	onload() {
		console.log("Loading Min3ditorHotkeys plugin");

		/**
		 * Add a new line after the current line
		 */
		this.addCommand({
			id: "editor-ih-new-line-after",
			name: "Add a new line after the current line",
			callback: () => this.newLine(true),
			hotkeys: [
			{
				modifiers: ["Mod", "Shift"],
				key: "Enter",
			},
			],
		});

		/**
		 * Add a new line before the current line
		 */
		this.addCommand({
			id: "editor-ih-new-line-before",
			name: "Add a new line before the current line",
			callback: () => this.newLine(),
			hotkeys: [
			{
				modifiers: ["Mod", "Alt"],
				key: "Enter",
			},
			],
		});

		/**
		 * Duplicate a line or selection
		 * Command + D
		 */
		this.addCommand({
			id: "editor-ih-duplicate-line",
			name: "Duplicate line or selection",
			callback: () => this.duplicateLines(),
			hotkeys: [
			{
				modifiers: ["Mod"],
				key: "D",
			},
			],
		});

	}

	onunload() {
		console.log("Unloading Min3ditorHotkeys plugin");
	}

	getSelectedText(editor: CodeMirror.Editor) {
	  if (editor.somethingSelected()) {
		//
		// Get selected text
		//
		let cursorStart : CodeMirror.Position = editor.getCursor("from");
		let cursorEnd : CodeMirror.Position = editor.getCursor("to");
		let content = editor.getRange(
		  { line: cursorStart.line, ch: cursorStart.ch },
		  { line: cursorEnd.line, ch: cursorEnd.ch }
		);

		return {
		  start: { line: cursorStart.line, ch: cursorStart.ch },
		  content: content,
		};
	  } else {
		//
		// Get current line
		//
		var lineNr = editor.getCursor().line;
		var contents = editor.getDoc().getLine(lineNr);
		let cursorStart = {
		  line: lineNr,
		  ch: 0,
		};
		let cursorEnd = {
		  line: lineNr,
		  ch: contents.length,
		};
		let content = editor.getRange(cursorStart, cursorEnd) + "\n";
		return { start: cursorStart, content: content };
	  }
	}

	duplicateLines() {
	  var activeLeaf = this.app.workspace.activeLeaf.view as MarkdownView;
	  var editor = activeLeaf.sourceMode.cmEditor
	  var selectedText = this.getSelectedText(editor);
	  var newString = selectedText.content;
	  editor.replaceRange(newString, selectedText.start, selectedText.start);
	}


	/**
	 * Create new line before or after the current line
	 * @param after true if new line will be created after current line
	 */
	newLine(after: boolean = false) {
		var activeLeaf = this.app.workspace.activeLeaf.view as MarkdownView;
		var editor = activeLeaf.sourceMode.cmEditor
		var offset = (after ? 1 : 0);
		let cursorStart = {
			line: editor.getCursor().line + offset,
			ch: 0,
		  };

		editor.replaceRange("\n", cursorStart, cursorStart);
		editor.setCursor(cursorStart);
	}

  }