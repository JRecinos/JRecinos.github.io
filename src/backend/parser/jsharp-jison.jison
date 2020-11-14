%{

import { tree_types } from '../ast/tree-types';
import { AST } from '../ast/ast';
export var JavaRoot = null;

var native_functions = ['print', 'println','toInt','toDouble','toChar'];

%}

%lex
%options ranges

D                 [0-9]
NZ                [1-9]
Ds                ("0"|{NZ}{D}*)
BSL               "\\".
%s                comment

%%



"//".*                /* skip comments */
"/*"                  this.begin('comment');
<comment>"*/"         this.popState();
<comment>.            /* skip comment content*/
\s+                   /* skip whitespace */

"{"                   return 'LBRACE'; /* Basic Syntax */
"}"                   return 'RBRACE';
"("                   return 'LPAREN';
")"                   return 'RPAREN';
"["                   return 'LBRACK';
"]"                   return 'RBRACK';
","                   return 'COMMA';
"?"                   return 'QUESTION';
":"                   return 'COLON';
";"                   return 'SEMICOLON';

"const"               return 'FINAL';

"void"                return 'VOID';

"import"              return 'IMPORT';
"if"                  return 'IF';
"else"                return 'ELSE';
"while"               return 'WHILE';
"do"                  return 'DO';
"for"                 return 'FOR';
"break"               return 'BREAK';
"continue"            return 'CONTINUE';
"switch"              return 'SWITCH';
"case"                return 'CASE';
"default"             return 'DEFAULT';
"try" 	              return 'TRY';
"catch"	              return 'CATCH';

"true"                return 'BOOLEAN_LITERAL';
"false"               return 'BOOLEAN_LITERAL';

"define"              return 'DEFINE';
"as"			            return 'AS';

"strc"                return 'NEW';
"return"              return 'RETURN';

"boolean"             return 'BOOLEAN';
"integer"             return 'INTEGER';
"double"              return 'DOUBLE';
"char"              	return 'CHAR';

"<="                  return 'LTEQ';
"<"                   return 'LT';
"=="                  return 'EQEQ';
">="                  return 'GTEQ';
">"                   return 'GT';
"!="                  return 'NOTEQ';
"||"                  return 'OROR';
"^"                   return 'XOR';
"^^"                  return 'POT';
"&&"                  return 'ANDAND';
"!"                   return 'NOT';
"="                   return 'EQ';
"+="                  return 'PLUSEQ';
"-="                  return 'MINUSEQ';
"*="                  return 'MULTEQ';
"/="                  return 'DIVEQ';
"%="                  return 'MODEQ';
"++"                  return 'PLUSPLUS';
"+"                   return 'PLUS';
"--"                  return 'MINUSMINUS';
"-"                   return 'MINUS';
"*"                   return 'MULT';
"/"                   return 'DIV';
"%"                   return 'MOD';
"."                   return 'DOT';

"null"                return 'NULL_LITERAL';

[_a-zA-Z][a-zA-Z0-9_]* return 'IDENTIFIER'; /* Varying form */
({Ds}"."{Ds}+)   			return 'DOUBLE_LITERAL';
{Ds}          				return 'INTEGER_LITERAL';
"\"\""                return 'STRING_LITERAL';
"\""([^"]|{BSL})*"\"" return 'STRING_LITERAL';
['][']                return 'CHARACTER_LITERAL';
['][^\n][']   				return 'CHARACTER_LITERAL';

<<EOF>>               return 'EOF';
.                     return 'INVALID';

/lex


%left ELSE
%left LBRACK
%left DOT


%start translation_unit

%% // language grammar

translation_unit :
	import_declarations type_declarations EOF {
		$$ = new AST("PROGRAM", null, @1.first_line, @1.first_column, $1, $2);
		JavaRoot = $$;
	}
	| type_declarations EOF {
		$$ = new AST("PROGRAM", null, @1.first_line, @1.first_column, $1);
		JavaRoot = $$;
	}
	;

// 19.3) Lexical Structure.
literal :
	INTEGER_LITERAL {
		$$ = new AST("INTEGER_LITERAL", parseInt($1), @1.first_line, @1.first_column);
	}
	|	DOUBLE_LITERAL {
		$$ = new AST("DOUBLE_LITERAL", parseFloat($1), @1.first_line, @1.first_column);
	}
	|	BOOLEAN_LITERAL {
		$$ = new AST("BOOLEAN_LITERAL", $1 == 'true', @1.first_line, @1.first_column);
	}
	|	CHARACTER_LITERAL {
		$$ = new AST("CHARACTER_LITERAL", $1, @1.first_line, @1.first_column);
	}
	|	STRING_LITERAL {
		$$ = new AST("STRING_LITERAL", $1.substring(1,$1.length-1), @1.first_line, @1.first_column);
	}
	|	NULL_LITERAL {
		$$ = new AST("NULL_LITERAL", null, @1.first_line, @1.first_column);
	}
	;


// 19.4) Types, Values, and Variables

primitive_type :
	numeric_type {
		$$ = $1;
	}
	|	BOOLEAN {
		$$ = new AST("BOOLEAN", null, @1.first_line, @1.first_column);
	}
	;

numeric_type :
	integral_type {
		$$ = $1;
	}
	|	floating_point_type {
		$$ = $1;
	}
	;

integral_type :
	INTEGER {
		$$ = new AST("INT", null, @1.first_line, @1.first_column);
	}
	|	CHAR {
		$$ = new AST("CHAR", null, @1.first_line, @1.first_column);
	}
	;
floating_point_type :
	DOUBLE {
		$$ = new AST("DOUBLE", null, @1.first_line, @1.first_column);
	}
	;


array_type :	primitive_type dims {
		$$ = new AST("ARRAY", null, @1.first_line, @1.first_column,
						$1,
						$2
					);
	}
	|	name dims {
		/*
			Here we check if name is String
		*/
			$$ = new AST("ARRAY", null, @1.first_line, @1.first_column,
					$1,
					$2
				);
	}
	;

// 19.5) Names
name	:	simple_name {
		$$ = $1;
	}
	|	qualified_name {
		$$ = $1;
	}
	;
simple_name :	IDENTIFIER {
		$$ = new AST("IDENTIFIER", $1, @1.first_line, @1.first_column);
	}
	;
qualified_name :
	name DOT IDENTIFIER {
		$$ = new AST('DOT', null, @2.first_line, @2.first_column,
			$1,
			new AST("IDENTIFIER", $3, @3.first_line, @3.first_column)
		);
	}
	;

// 19.6) Packages
import_declarations :
	IMPORT IDENTIFIER {
		$$ = new AST("IMPORTS", null, @1.first_line, @1.first_column, $1);
	}
	|	import_declarations COMMA IDENTIFIER {
		$$ = $1;
		$1.addChild($2);
	}
	;

type_declarations :
	type_declaration {
		$$ = new AST('TYPE_DECLARATIONS', null, @1.first_line, @1.first_column, $1);
	}
	|	type_declarations type_declaration {
		$$ = $1;
		$1.addChild($2);
	}
	;


// 19.8.1) type declaration

type_declaration :
	class_member_declaration {
		$$ = $1;
	}
	|	struct_declaration {
		$$ = $1;
	}
	;

struct_declaration :
	DEFINE IDENTIFIER AS struct_body {

	}
	;


struct_body :
	LBRACK struct_attribute_list RBRACK {

	}
	;

struct_attribute_list :
	local_variable_declaration {

	}
	| struct_attribute_list COMMA local_variable_declaration {

	}
	;

class_member_declaration :
	field_declaration {
		$$ = $1;
	}
	|	method_declaration {
		$$ = $1;
	}
	| SEMICOLON {
		$$ = new AST("NO_OP", null, @1.first_line, @1.first_column);
	}
	;

// 19.8.2) Field Declarations
modifiers :
	FINAL {
		$$ = new AST("CONST", null, @1.first_line, @1.first_column);
	}
	| GLOBAL {
		$$ = new AST("GLOBAL", null, @1.first_line, @1.first_column);
	}
	| VAR {
		$$ = new AST("VAR", null, @1.first_line, @1.first_column);
	}
	;


field_declaration :
	primitive_type variable_declarators SEMICOLON {
			$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					...$2
			);

	}
	| name variable_declarators SEMICOLON {
			$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
				$1,
				...$2
			);
	}
	| modifiers variable_declarators SEMICOLON{
			$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
				$1,
				...$2
			);
	}
	;

variable_declarators :
	variable_declarator {
		$$ = [$1]
	}
	|	variable_declarators COMMA variable_declarator {
		$$ = $1;
		$$.push($3);
	}
	;

variable_declarator :
	variable_declarator_id {
		$$ = $1;
	}
	|	variable_declarator_id EQ variable_initializer {
		$$ = new AST("EQ", null, @2.first_line, @2.first_column,
				$1,
				$3
			);
	}
	;

variable_declarator_id :
	IDENTIFIER {
		$$ = new AST("IDENTIFIER", $1, @1.first_line, @1.first_column);
	}
	|	IDENTIFIER dims {
		$$ = new AST("ARRAY_IDENTIFIER", $1, @1.first_line, @1.first_column);
		$$.addChild($2);
	}
	;

variable_initializer :
	expression {
		$$ = $1;
	}
	|	array_initializer {
		$$ = $1;
	}
	;

// 19.8.3) Method Declarations
method_declaration :
	method_header method_body {
		{
			let tNode = $1[0];
			let type = 'FUNCTION_DECLARATION';
			if( tNode.getType() == tree_types.types.MODIFIERS ) {
				if( $1[2].getValue() == "main" ){
					type = 'MAIN_DECLARATION';
				}
			}
			else{
				if( $1[1].getValue() == "main" ){
					type = 'MAIN_DECLARATION';
				}
			}

			$$ = new AST(type,null, @1.first_line, @1.first_column, ...$1, $2);
		}
	}
	;

method_header :
	primitive_type method_declarator {
		$$ = [ $1, ...$2 ];
	}
	|	name method_declarator {
		/*
			CHECK IF NAME IS STRING
		*/
		$$ = [ $1, ...$2];
	}
	//hotfix
	| modifiers primitive_type dims method_declarator {
		$$ = [ $1,  new AST('ARRAY_TYPE',null,@1.first_line,@1.first_column, $2, $3), ...$4];
	}
	|	modifiers name dims method_declarator {
		$$ = [ $1, new AST('ARRAY_TYPE',null,@1.first_line,@1.first_column, $2, $3), ...$4];
	}
	|	primitive_type dims method_declarator {
		$$ = [ new AST('ARRAY_TYPE',null,@1.first_line,@1.first_column, $1, $2), ...$3 ];
	}
	|	name dims method_declarator {
		/*
			CHECK IF NAME IS STRING
		*/
		$$ = [ new AST('ARRAY_TYPE',null,@1.first_line,@1.first_column, $1, $2), ...$3];
	}
	//fin hotfix
	|	VOID method_declarator {
		$$ =[ new AST("VOID",null,@2.first_line, @2.first_column), ...$2];
	}
	;

method_declarator :
	IDENTIFIER LPAREN formal_parameter_list RPAREN {
			$$ = [	new AST("IDENTIFIER", $1, @1.first_line, @1.first_column ), $3]
	}
	| IDENTIFIER LPAREN RPAREN {
			$$ = [ new AST("IDENTIFIER", $1, @1.first_line, @1.first_column )	];
	}
	;

formal_parameter_list :
	formal_parameter {
		$$ = new AST('FORMAL_PARAMETER_LIST', null, @1.first_line, @1.first_column, $1);
	}
	|	formal_parameter_list COMMA formal_parameter {
		$$ = $1;
		$$.addChild($3);
	}
	;
formal_parameter :
	primitive_type variable_declarator_id {
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2);
	}
	|	primitive_type dims variable_declarator_id {
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2, $3);
	}
	|	name variable_declarator_id {
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2);
	}
	|	name dims variable_declarator_id {
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2, $3);
	}
	;

method_body :	block {
		$$ = $1;
	}
	|	SEMICOLON {
		$$ = null;
	}
	;

constant_declaration :
	field_declaration {
		$$ = $1;
	}
	;

// 19.10) Arrays
array_initializer :
	LBRACE variable_initializers COMMA RBRACE {
		$$ = new AST('ARRAY_LITERAL', null, @1.first_line, @1.first_column,...$2.getChildren());
	}
	|	LBRACE variable_initializers RBRACE {
		$$ = new AST('ARRAY_LITERAL', null, @1.first_line, @1.first_column,...$2.getChildren());
	}
	|	LBRACE COMMA RBRACE {
		$$ = new AST('ARRAY_LITERAL', null, @1.first_line, @1.first_column);
	}
	|	LBRACE RBRACE {
		$$ = new AST('ARRAY_LITERAL', null, @1.first_line, @1.first_column);
	}
	;

variable_initializers :
	variable_initializer {
		$$ = new AST('VARIABLE_INITIALIZER', null, @1.first_line, @1.first_column,$1);
	}
	|	variable_initializers COMMA variable_initializer {
		$$ = $1;
		$$.addChild($3);
	}
	;

// 19.11) Blocks and Statements
block :	LBRACE block_statements RBRACE {
		$2.changeType("BLOCK");
		$$ = $2;
	}
	| LBRACE RBRACE {
			$$ = new AST("BLOCK", null, @1.first_line, @1.first_column);
	}
	;

block_statements :
	block_statement {
		$$ = new AST("STMT_LIST", null, @1.first_line, @1.first_column, $1);
	}
	|	block_statements block_statement {
		$1.addChild($2);
		$$ = $1;
	}
	;

block_statement :
	local_variable_declaration_statement {
		$$ = $1;
	}
	|	statement {
		$$ = $1;
	}
	;

local_variable_declaration_statement :
	local_variable_declaration SEMICOLON {
		$$ = $1;
	}
	;

local_variable_declaration :
	primitive_type variable_declarators {
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					...$2
			);
	}
	|	modifiers variable_declarators {
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
						$2,
						...$3
					);
	}
	| name variable_declarators {
		/*
			CHECK IF NAME IS STRING
		*/
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
						$1,
						...$2
				);
	}
	;

/* statements */

statement :
	statement_without_trailing_substatement {

	}
	|	if_then_statement {

	}
	|	if_then_else_statement {

	}
	|	while_statement {

	}
	|	for_statement {

	}
	;

statement_no_short_if :
	statement_without_trailing_substatement {

	}
	|	if_then_else_statement_no_short_if {

	}
	|	while_statement_no_short_if {

	}
	|	for_statement_no_short_if {

	}
	;

statement_without_trailing_substatement :
	block {

	}
	|	empty_statement {

	}
	|	expression_statement {

	}
	|	switch_statement {

	}
	|	do_statement {

	}
	|	break_statement {

	}
 	|	continue_statement {

	 }
	|	return_statement {

	}
	|	throw_statement {

	}
	|	try_statement {

	}
	;

if_then_statement :
	IF LPAREN expression RPAREN statement {

	}
	;

if_then_else_statement :
		IF LPAREN expression RPAREN statement_no_short_if
			ELSE statement {

	}
	;
if_then_else_statement_no_short_if :
		IF LPAREN expression RPAREN statement_no_short_if
			ELSE statement_no_short_if {

	}
	;

while_statement :
	WHILE LPAREN expression RPAREN statement {

	}
	;

while_statement_no_short_if :
	WHILE LPAREN expression RPAREN statement_no_short_if {

	}
	;

for_statement :
	FOR LPAREN for_init SEMICOLON expression SEMICOLON
		for_update RPAREN statement {

	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		 for_update RPAREN statement {

	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		for_update RPAREN statement {

	}
	| FOR LPAREN SEMICOLON SEMICOLON
		for_update RPAREN statement {

	}
	| FOR LPAREN for_init SEMICOLON expression SEMICOLON
		RPAREN statement {

	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		RPAREN statement {

	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		RPAREN statement {

	}
	| FOR LPAREN SEMICOLON SEMICOLON
		RPAREN statement {

	}
	;

for_statement_no_short_if :
	FOR LPAREN for_init SEMICOLON expression SEMICOLON
		for_update RPAREN statement_no_short_if {

	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		for_update RPAREN statement_no_short_if {

	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		for_update RPAREN statement_no_short_if {

	}
	| FOR LPAREN SEMICOLON SEMICOLON
		for_update RPAREN statement_no_short_if {

	}
	| FOR LPAREN for_init SEMICOLON expression SEMICOLON
		RPAREN statement_no_short_if {

	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		RPAREN statement_no_short_if {

	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		RPAREN statement_no_short_if {

	}
	| FOR LPAREN SEMICOLON SEMICOLON
		RPAREN statement_no_short_if {

	}
	;

for_init : statement_expression_list {

	}
	|	local_variable_declaration {

	}
	;

for_update :	statement_expression_list {

	}
	;

statement_expression_list :
	statement_expression {

	}
	|	statement_expression_list COMMA statement_expression {

	}
	;


throw_statement :
	THROW expression SEMICOLON {

	}
	;

try_statement :
	TRY block catches
	;

catches :	catch_clause {

	}
	|	catches catch_clause {

	}
	;

catch_clause :
	CATCH LPAREN expression RPAREN block {

	}
	;

statement_expression :
	expression {

	}
	;


empty_statement :
	SEMICOLON {
		$$ = new AST("NO_OP", null, @1.first_line, @1.first_column, $1);
	}
	;

expression_statement :
	expression SEMICOLON {
		$$ = new AST("EXPRESSION_STMT", null, @1.first_line, @1.first_column, $1);
	}
	;


switch_statement :
	SWITCH LPAREN expression RPAREN switch_block {
		$$ = new AST('SWITCH', null, @1.first_line, @1.first_column, $3, $5);
	}
	;
switch_block :
	LBRACE switch_block_statement_groups switch_labels RBRACE {
		$$ = $2;
		$2.addChild($3);
	}
	|	LBRACE switch_block_statement_groups RBRACE {
		$$ = $2;
	}
	|	LBRACE switch_labels RBRACE {
		$$ = new AST("SWITCH_BODY", null, @1.first_line, @1.first_column, $2);
	}
	|	LBRACE RBRACE {
		$$ = new AST("SWITCH_BODY", null, @1.first_line, @1.first_column);
	}
	;

switch_block_statement_groups :
	switch_block_statement_group {
		$$ = new AST("SWITCH_BODY", null, @1.first_line, @1.first_column,$1);
	}
	|	switch_block_statement_groups switch_block_statement_group {
		$$ = $1;
		$$.addChild($2);
	}
	;

switch_block_statement_group :
	switch_labels block_statements {
		$$ = $1;
		$1.addChild($2);
	}
	;

switch_labels :
	switch_label {
		$$ = new AST('CASE_LABEL_LIST', null, @1.first_line, @1.first_column, ...$1);
	}
	|	switch_labels switch_label {
		$$ = $1;
		$$.addChild(...$2);
	}
	;

switch_label :
	CASE constant_expression COLON {
		$$ = [$2];
	}
	|	DEFAULT COLON {
		$$ = [new AST("DEFAULT", null, @1.first_line, @1.first_column)]
	}
	;

do_statement :
	DO statement WHILE LPAREN expression RPAREN SEMICOLON {
		$$ = new AST("DO",null,@1.first_line,@1.first_column,
					$2,
					$5
				);
	}
	;

expression_list :
	expression {
		$$ = new AST('EXPRESSION_LIST', null, @1.first_line, @1.first_column,$1);
	}
	|	expression_list COMMA expression {
		$$ = $1;
		$$.addChild($3);
	}
	;


break_statement :
	BREAK SEMICOLON {
		$$ = new AST("BREAK", null, @1.first_line, @1.first_column);
	}
	;

continue_statement :
	CONTINUE SEMICOLON {
		$$ = new AST("CONTINUE", null, @1.first_line, @1.first_column);
	}
	;

return_statement :
	RETURN SEMICOLON {
		$$ = new AST("RETURN", null, @1.first_line, @1.first_column);
	}
	| RETURN expression SEMICOLON {
		$$ = new AST("RETURN", null, @1.first_line, @1.first_column, $2);
	}
	;


// 19.12) Expressions
primary :	primary_no_new_array {
		$$ = $1;
	}
	|	array_creation_expression {
		$$ = $1;
	}
	;

primary_no_new_array :
	literal {
		$$ = $1;
	}
	|	LPAREN expression RPAREN {
		$$ = $2;
	}
	|	class_instance_creation_expression {
		$$ = $1;
	}
	|	method_invocation {
		$$ = $1;
	}
	| left_hand_side {
		$$ = $1;
	}
	;

class_instance_creation_expression :
	NEW name LPAREN  RPAREN {
		$$ = new AST("NEW",null,@1.first_line, @1.first_column,
					new AST("CONSTRUCTOR_CALL", null, @1.first_line,@1.first_column,
						$2
					)
				);
	}
	;


argument_list :
	expression {
		$$ = new AST('EXPRESSION_LIST',null,@1.first_line,@1.first_column,$1);
	}
	|	argument_list COMMA expression {
		$$ = $1;
		$$.addChild($3);
	}
	;

array_creation_expression :
	NEW primitive_type dim_exprs {
		$$ = new AST("NEW_ARRAY",null,@1.first_line,@1.first_column,
					$2,
					$3
				);
	}
	|	NEW name dim_exprs {
			/*
			Here we check if name is string
		*/
		$$ = new AST("NEW_ARRAY",null,@1.first_line,@1.first_column,
						$2,
						$3
					);
	}
	|	NEW primitive_type dims array_initializer {
		$$ = new AST("NEW_ARRAY",null,@1.first_line,@1.first_column,
					$2,
					$3,
					$4
				);
	}
	|	NEW name dims array_initializer {
		/*
			Here we check if name is string
		*/
		$$ = new AST("NEW_ARRAY",null,@1.first_line,@1.first_column,
									$2,
									$3,
									$4
								);
	}
	;

dim_exprs :	dim_expr {
		$$ = new AST("ARRAY_DIMS",null,@1.first_line, @1.first_column,
					$1
				);
	}
	|	dim_exprs dim_expr {
		$$ = $1;
		$$.addChild($2);
	}
	;

dim_expr :	LBRACK expression RBRACK {
		$$ = new AST("DIM", null,@1.first_line, @1.first_column, $2);
	}
	;

dims :	LBRACK RBRACK {
		$$ = new AST("ARRAY_DIMS",null,@1.first_line, @1.first_column,
					new AST("DIM", null,@1.first_line, @1.first_column)
				);
	}
	|	dims LBRACK RBRACK {
		$$ = $1;
		$$.addChild(new AST("DIM",null,@2.first_line, @2.first_column));
	}
	;

field_access :
	primary DOT IDENTIFIER {
		$$ = new AST("DOT",null,@2.first_line,@2.first_column,
					$1,
					new AST("IDENTIFIER",$3,@3.first_line,@3.first_column)
				);
	}
	;

method_invocation :
	name LPAREN argument_list RPAREN {
		{
			let type = native_functions.find(item => item == $1.getValue());
			$$ = new AST((type === undefined?"FUNCTION_CALL":"NATIVE_FUNCTION_CALL"),null,@1.first_line,@1.first_column,
				$1,
				$3
			);
		}
	}
	| name LPAREN RPAREN {

		{
			let type = native_functions.find(it=>it==$1.getValue());
			$$ = new AST((type === undefined?"FUNCTION_CALL":"NATIVE_FUNCTION_CALL"),null,@1.first_line,@1.first_column,
				$1
			);
		}
	}
	|	primary DOT IDENTIFIER LPAREN RPAREN {
			$$ = new AST("FUNCTION_CALL",null,@3.first_line,@3.first_column,
				new AST("DOT", null, @2.first_line, @2.first_column,
					$1,
					new AST("IDENTIFIER",$3,@3.first_line,@3.first_column)
				)
			);
	}
	;

array_access :
	name LBRACK expression RBRACK {
		if($1.type != tree_types.types.ARRAY_ACCESS){
			$$ = new AST("ARRAY_ACCESS", null, @1.first_line, @1.first_column, $1, $3);
		}else{
			$$ = $1;
			$$.addChild($3);
		}
	}
	|	primary_no_new_array LBRACK expression RBRACK {

		if($1.type != tree_types.types.ARRAY_ACCESS){
			$$ = new AST("ARRAY_ACCESS", null, @1.first_line, @1.first_column, $1, $3);
		}else{
			$$ = $1;
			$$.addChild($3);
		}

	}
	;

postfix_expression :
	primary {
		$$ = $1;
	}
	|	name {
		$$ = $1;
	}
	|	postincrement_expression {
		$$ = $1;
	}
	|	postdecrement_expression {
		$$ = $1;
	}
	;

postincrement_expression :
	postfix_expression PLUSPLUS {
		$$ = new AST("POSTINC", null, @2.first_line, @2.first_column, $1);
	}
	;

postdecrement_expression :
	postfix_expression MINUSMINUS {
		$$ = new AST("POSTDEC", null, @2.first_line, @2.first_column, $1);
	}
	;

unary_expression :
	preincrement_expression {
		$$ = $1;
	}
	|	predecrement_expression {
		$$ = $1;
	}
	|	PLUS unary_expression {
		$$ = new AST("PLUS", null,  @1.first_line, @1.first_column, $2);
	}
	|	MINUS unary_expression {
		$$ = new AST("MINUS", null,  @1.first_line, @1.first_column, $2);
	}
	|	unary_expression_not_plus_minus {
		$$ = $1;
	}
	;
preincrement_expression :
	PLUSPLUS unary_expression {
		$$ = new AST("PREINC", null,  @1.first_line, @1.first_column, $2);
	}
	;
predecrement_expression :
	MINUSMINUS unary_expression {
		$$ = new AST("PREDEC", null,  @1.first_line, @1.first_column, $2);
	}
	;
unary_expression_not_plus_minus :
	postfix_expression {
		$$ = $1;
	}
	|	NOT unary_expression {
		$$ = new AST("NOT", null, @1.first_line, @1.first_column, $2);
	}
	|	cast_expression {
		$$ = $1;
	}
	;
cast_expression :
	LPAREN primitive_type dims RPAREN unary_expression {
			$$ = new AST('CAST', null, @1.first_line, @1.first_column,
									new AST('ARRAY', null, @2.first_line, @2.first_column, $2, $3),
									$5
								);
	}
	| LPAREN primitive_type RPAREN unary_expression {
			$$ = new AST('CAST', null, @1.first_line, @1.first_column,
								$2,
								$4
							);
	}
	|	LPAREN expression RPAREN unary_expression_not_plus_minus {
			$$ = new AST('CAST', null, @1.first_line, @1.first_column,
										$2,
										$4
									);
	}
	|	LPAREN name dims RPAREN unary_expression_not_plus_minus {
			/*
				Here we must check if name == string
			*/

			$$ = new AST('CAST', null, @1.first_line, @1.first_column,
										new AST('ARRAY', null, @2.first_line, @2.first_column, $2, $3),
										$4
									);
	}
	;

multiplicative_expression :
	unary_expression {
		$$ = $1;
	}
	|	multiplicative_expression MULT unary_expression {
		$$ = new AST("MULT", null, @2.first_line, @2.first_column,
						$1,
						$3
					);
	}
	|	multiplicative_expression DIV unary_expression {
			$$ = new AST("DIV", null, @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	multiplicative_expression MOD unary_expression {
			$$ = new AST("MOD", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	;

additive_expression :
	multiplicative_expression {
		$$ = $1;
	}
	|	additive_expression PLUS multiplicative_expression {
		$$ = new AST("PLUS", null, @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	additive_expression MINUS multiplicative_expression {
		$$ = new AST("MINUS", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	;

relational_expression :
	additive_expression {
		$$ = $1;
	}
	|	relational_expression LT additive_expression {
		$$ = new AST("LT", null,@2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	relational_expression GT additive_expression {
		$$ = new AST("GT", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	relational_expression LTEQ additive_expression {
		$$ = new AST("LTEQ", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	relational_expression GTEQ additive_expression {
			$$ = new AST("GTEQ", null, @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	relational_expression INSTANCEOF name {
		$$ = new AST("INSTANCEOF", null, @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	relational_expression INSTANCEOF array_type {
		$$ = new AST("INSTANCEOF", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	;

equality_expression :
	relational_expression {
		$$ = $1;
	}
	|	equality_expression EQEQ relational_expression {
		$$ = new AST("EQEQ", null,@2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	|	equality_expression NOTEQ relational_expression {
		$$ = new AST("NOTEQ", null,  @2.first_line, @2.first_column,
								$1,
								$3
							);
	}
	;

exclusive_or_expression :
	equality_expression {
		$$ = $1;
	}
	|	exclusive_or_expression XOR equality_expression {

		//WE CREATE THE LH || RH && !LH || !RH
		let lhor = new AST("OROR", null,@2.first_line, @2.first_column, $1, $3 ),
				rhor = new AST("OROR", null,@2.first_line, @2.first_column);

		let rhlhnot = new AST("NOT", null,@2.first_line, @2.first_column,$1.copyWithChildren()),
				rhrhnot = new AST("NOT", null,@2.first_line, @2.first_column,$3.copyWithChildren());

		rhor.addChild(rhlhnot,rhrhnot);

		$$ = new AST("ANDAND", null,@2.first_line, @2.first_column,
								lhor,
								rhor
							);
	}
	;

conditional_and_expression :
	exclusive_or_expression {
		$$ = $1;
	}
	|	conditional_and_expression ANDAND exclusive_or_expression {
		$$ = new AST("ANDAND", null, @2.first_line,@2.first_column,
							$1,
							$3
						);
	}
	;
conditional_or_expression :
	conditional_and_expression {
		$$ = $1;
	}
	|	conditional_or_expression OROR conditional_and_expression {
		$$ = new AST("OROR", null, @2.first_line, @2.first_column,
							$1,
							$3
						);
	}
	;
conditional_expression :
	conditional_or_expression {
		$$ = $1;
	}
	|	conditional_or_expression QUESTION expression
			COLON conditional_expression {
			$$ = new AST("QUESTION",null, @1.first_line,@1.first_column,
			 							$1,
										$3,
										$5
									);
	}
	;

assignment_expression :
	conditional_expression {
		$$ = $1;
	}
	|	assignment {
		$$ = $1;
	}
	;

assignment :	left_hand_side assignment_operator assignment_expression {
		if($2.childrenSize() > 0){
			$2.insertAt(0,$1);
			let node = $1.copyWithChildren();
			$2.getChild(1).addChild(node,$3);
			$$ = $2;
		}else{
			$2.addChild($1,$3);
			$$ = $2;
		}
	}
	| name assignment_operator assignment_expression {

		if($2.childrenSize() > 0){
			console.log('entra acá');
			$2.insertAt(0,$1);
			let node = $1.copyWithChildren();
			$2.getChild(1).addChild(node,$3);
			$$ = $2;
		}else{
			$2.addChild($1,$3);
			$$ = $2;
		}

	}
	;

left_hand_side :
	field_access {
		$$ = $1;
  }
	|	array_access {
    $$ = $1;
  }
	;


assignment_operator :
	EQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column);
	}
	|	MULTEQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column,
									new AST("MULT", null, @1.first_line, @1.first_column)
								);
	}
	|	DIVEQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column,
									new AST("DIV", null, @1.first_line, @1.first_column)
								);
	}
	|	MODEQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column,
								new AST("MOD", null, @1.first_line, @1.first_column)
							);
	}
	|	PLUSEQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column,
								new AST("PLUS", null, @1.first_line, @1.first_column)
							);
	}
	|	MINUSEQ {
		$$ = new AST("EQ", null, @1.first_line, @1.first_column,
								new AST("MINUS", null, @1.first_line, @1.first_column)
							);
	}
	;

expression :	assignment_expression {
		$$ = $1;
	}
	;

constant_expression :
	expression {
		$$ = $1;
	}
	;

