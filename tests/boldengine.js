/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import BoldEngine from '/ckeditor5/basic-styles/boldengine.js';
import VirtualTestEditor from '/tests/core/_utils/virtualtesteditor.js';
import { getData as getModelData, setData as setModelData } from '/ckeditor5/engine/dev-utils/model.js';
import { getData as getViewData } from '/ckeditor5/engine/dev-utils/view.js';
import ToggleAttributeCommand from '/ckeditor5/core/command/toggleattributecommand.js';

describe( 'BoldEngine', () => {
	let editor, doc;

	beforeEach( () => {
		return VirtualTestEditor.create( {
				features: [ BoldEngine ]
			} )
			.then( newEditor => {
				editor = newEditor;

				doc = editor.document;

				doc.schema.allow( { name: '$text', inside: '$root' } );
			} );
	} );

	it( 'should be loaded', () => {
		expect( editor.plugins.get( BoldEngine ) ).to.be.instanceOf( BoldEngine );
	} );

	it( 'should set proper schema rules', () => {
		expect( doc.schema.check( { name: '$inline', attributes: [ 'bold' ] } ) ).to.be.true;
	} );

	describe( 'command', () => {
		it( 'should register bold command', () => {
			expect( editor.commands.has( 'bold' ) ).to.be.true;

			const command = editor.commands.get( 'bold' );

			expect( command ).to.be.instanceOf( ToggleAttributeCommand );
			expect( command ).to.have.property( 'attributeKey', 'bold' );
		} );
	} );

	describe( 'data pipeline conversions', () => {
		it( 'should convert <strong> to bold attribute', () => {
			editor.setData( '<strong>foo</strong>bar' );

			expect( getModelData( doc, { withoutSelection: true } ) ).to.equal( '<$text bold="true">foo</$text>bar' );
			expect( editor.getData() ).to.equal( '<strong>foo</strong>bar' );
		} );

		it( 'should convert <b> to bold attribute', () => {
			editor.setData( '<b>foo</b>bar' );

			expect( getModelData( doc, { withoutSelection: true } ) ).to.equal( '<$text bold="true">foo</$text>bar' );
			expect( editor.getData() ).to.equal( '<strong>foo</strong>bar' );
		} );

		it( 'should convert font-weight:bold to bold attribute', () => {
			editor.setData( '<span style="font-weight: bold;">foo</span>bar' );

			expect( getModelData( doc, { withoutSelection: true } ) ).to.equal( '<$text bold="true">foo</$text>bar' );
			expect( editor.getData() ).to.equal( '<strong>foo</strong>bar' );
		} );
	} );

	describe( 'editing pipeline conversion', () => {
		it( 'should convert attribute', () => {
			setModelData( doc, '<$text bold="true">foo</$text>bar' );

			expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal( '<strong>foo</strong>bar' );
		} );
	} );
} );
