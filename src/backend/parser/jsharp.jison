%{
  import { tree_types } from '../ast/tree-types';
  import { AST } from '../ast/ast';
  export var JSharpRoot = null;

  var native_functions = ['print', 'println'];
%}

%lex
%options case-insensitive


D                 [0-9]
NZ                [1-9]
Ds                ("0"|{NZ}{D}*)
BSL               "\\".
%s                comment
escapechar [\'\"\\bfnrtv]
escape \\{escapechar}
acceptedcharsdouble [^\"\\]+
stringdouble {escape}|{acceptedcharsdouble}
stringliteral (\"{stringdouble}*\")
charliteral (\'{stringdouble}\')

%%



"//".*                /* skip comments */
"/*"                  this.begin('comment');
<comment>"*/"         this.popState();
<comment>.            /* skip comment content*/
\s+                   /* skip whitespace */


":="                  return 'PEQ';
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
'$'										return 'DOLLAR'

"const"               return 'FINAL';
"var"									return 'VAR';
'global'							return 'GLOBAL';

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
"throw"								return 'THROW';

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
"==="                 return 'REQEQ';
"=="                  return 'EQEQ';
">="                  return 'GTEQ';
">"                   return 'GT';
"!="                  return 'NOTEQ';
"||"                  return 'OROR';
"^^"                  return 'POT';
"^"                   return 'XOR';
"&&"                  return 'ANDAND';
"!"                   return 'NOT';
"="                   return 'EQ';
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
{stringliteral}				return 'STRING_LITERAL';
{charliteral}         return 'CHARACTER_LITERAL';


<<EOF>>               return 'EOF';
.                     return 'INVALID';

/lex

%left PEQ, EQ
%left ELSE
%left LBRACK
%left DOT


%start translation_unit

%% // language grammar

translation_unit :
	import_declarations SEMICOLON type_declarations EOF {
		$$ = new AST("PROGRAM", null, @1.first_line, @1.first_column, $1, ...$3);
		JSharpRoot = $$;
	}
	| type_declarations EOF {
		$$ = new AST("PROGRAM", null, @1.first_line, @1.first_column, ...$1);
		JSharpRoot = $$;
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
  	$$ = new AST("INTEGER", null, @1.first_line, @1.first_column);
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

		if($1.value.toLowerCase() === 'string')
			$1.changeType("STRING");

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
		$$ = new AST("IDENTIFIER",$1,@1.first_line,@1.first_column);
	}
	;

qualified_name :
	name DOT IDENTIFIER {
		$$ = new AST("DOT", null, @1.first_line, @1.first_column,
					$1,
					new AST("IDENTIFIER",$3,@3.first_line,@3.first_column)
				)
	}
	;

// 19.6) Packages
import_declarations :
	IMPORT expression {
		$$ = new AST("IMPORTS", null, @1.first_line, @1.first_column, $2);
	}
	|	import_declarations COMMA expression {
		$$ = $1;
		$$.addChild($3);
	}
	;

type_declarations :
	type_declaration {
		$$ = [$1];
	}
	|	type_declarations type_declaration {
		$$ = $1;
		$$.push($2);
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
	DEFINE name AS struct_body SEMICOLON{
		$$ = new AST("STRUCT_DECLARATION",null, @1.first_line, @1.first_column,
					$2,
					$4
				)
	}
	;


struct_body :
	LBRACK struct_attribute_list RBRACK {
		$$ = $2;
	}
	;

struct_attribute_list :
	struct_variable_declaration {
		$$ = new AST("STRUCT_LIST", null ,@1.first_line, @1.first_column,
						$1
					);
	}
	| struct_attribute_list COMMA struct_variable_declaration {
		$$ = $1;
		$$.addChild($3);
	}
	;

struct_variable_declaration :
	primitive_type IDENTIFIER
	{
		$$ = new AST("ATTR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					new AST("ID_LIST", null,  @2.first_line, @2.first_column,
						new AST("IDENTIFIER", $2, @2.first_line, @2.first_column)
					)
				);
  }
	| name IDENTIFIER
	{
		if($1.value.toLowerCase() === "string")
			$1.changeType("STRING");

		$$ = new AST("ATTR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					new AST("ID_LIST", null,  @2.first_line, @2.first_column,
						new AST("IDENTIFIER", $2, @2.first_line, @2.first_column)
					)
				);
	}
	| array_type IDENTIFIER {
		$$ = new AST("ATTR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					new AST("ID_LIST", null,  @2.first_line, @2.first_column,
						new AST("IDENTIFIER", $2, @2.first_line, @2.first_column)
					)
				);
	}
	| primitive_type IDENTIFIER EQ expression
	{
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					new AST("EQ", null, @3.first_line, @3.first_column,
						new AST("ID_LIST", null,  @2.first_line, @2.first_column,
							new AST("IDENTIFIER", $2, @2.first_line, @2.first_column),
						),
						$4
					)
				);
  }
	| name IDENTIFIER EQ expression
	{
		if($1.value.toLowerCase() === "string")
			$1.changeType("STRING");

		$$ = new AST("ATTR_DECLARATION", null, @1.first_line, @1.first_column,
					$1,
					new AST("EQ", null, @3.first_line, @3.first_column,
						new AST("ID_LIST", null,  @2.first_line, @2.first_column,
							new AST("IDENTIFIER", $2, @2.first_line, @2.first_column),
						),
						$4
					)
				);
	}
	| array_type IDENTIFIER EQ expression
	{

		$$ = new AST("ATTR_DECLARATION", null, @1.first_line, @1.first_column,
						$1,
						new AST("EQ", null, @3.first_line, @3.first_column,
							new AST("ID_LIST", null,  @2.first_line, @2.first_column,
								new AST("IDENTIFIER", $2, @2.first_line, @2.first_column),
							),
							$4
						)
					);
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
		$$ = new AST("FINAL",null,@1.first_line, @1.first_column);
	}
	| GLOBAL {
		$$ = new AST("GLOBAL",null,@1.first_line, @1.first_column);
	}
	| VAR {
		$$ = new AST("VAR",null,@1.first_line, @1.first_column);
	}
	;


field_declaration :
	variable_declaration_statement {
		$$ = $1;
	}
	;

variable_declarators :
	variable_declarator {
		$$ = new AST("ID_LIST",null,@1.first_line,@1.first_column, $1);
	}
	|	variable_declarators COMMA variable_declarator {
		$$ = $1
		$$.addChild($3);
	}
	;

variable_declarator :
	variable_declarator_id {
		$$ = $1;
	}
	;

variable_declarator_id :
	IDENTIFIER {
		$$ = new AST("IDENTIFIER", $1, @1.first_line, @1.first_column);
	}
	/*|	IDENTIFIER dims {
		$$ = new AST("ARRAY_IDENTIFIER", $1, @1.first_line, @1.first_column);
		$$.addChild($2);
	}*/
	;

// 19.8.3) Method Declarations
method_declaration :
	method_header method_body {
		$$ = $1;
		$$.addChild($2);
	}
	;

method_header :
	primitive_type method_declarator {
		$$ = $2;
		$$.insertAt(0,$1);
	}
	|	name method_declarator {
		$$ = $2;
		if($1.value.toLowerCase() === "string"){
			$1.changeType("STRING");
		}
		$$.insertAt(0,$1);
	}
	| array_type method_declarator {
		$$ = $2;
		$$.insertAt(0, $1);
	}
	|	VOID method_declarator {
		$$ = $2;
		if($$.getChild(0).value.toLowerCase() === "principal")
			$$.changeType("MAIN_DECLARATION");
		$$.insertAt(0,new AST("VOID",null,@1.first_line, @1.first_column));
	}
	;

method_declarator :
	IDENTIFIER LPAREN formal_parameter_list RPAREN {
		$$ = new AST("FUNCTION_DECLARATION",$1, @1.first_line, @1.first_column,
					new AST("IDENTIFIER", $1, @1.first_line, @1.first_column),
					$3
				)
	}
	| IDENTIFIER LPAREN RPAREN {
		$$ = new AST("FUNCTION_DECLARATION",$1, @1.first_line, @1.first_column,
					new AST("IDENTIFIER", $1, @1.first_line, @1.first_column)
				)
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
	|	name variable_declarator_id {
		if($1.value.toLowerCase() === 'string')
			$1.changeType("STRING");
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2);
	}
	|	array_type variable_declarator_id {
		$$ = new AST('FORMAL_PARAMETER',null, @1.first_line, @1.first_column, $1, $2);
	}
	;

method_body :	block {
		$$ = $1;
	}
	|	SEMICOLON {
		$$ = new AST("BLOCK", null, @1.first_line, @1.first_column);
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

	variable_initializer :
	expression {
		$$ = $1;
	}
	;

// 19.11) Blocks and Statements
block :	LBRACE block_statements RBRACE {
		$$ = $2;
		$$.changeType("BLOCK");
	}
	| LBRACE RBRACE {
		$$ = new AST("BLOCK",null,@1.first_line, @1.first_column);
	}
	;

block_statements :
	block_statement {
		$$ = new AST("STMT_LIST",null,@1.first_line, @1.first_column,$1) ;
	}
	|	block_statements block_statement {
		$$ = $1;
		$$.addChild($2);
	}
	;

block_statement :
	variable_declaration_statement {
		$$ = $1;
	}
	|	statement {
		$$ = $1;
	}
	;

variable_declaration_statement :
	variable_declaration EQ expression SEMICOLON {
		$$ = $1;
		let tmp = $$.deleteAt(1);
		$$.addChild(
							new AST("EQ",null,@1.first_line,@1.first_column,
								tmp[0],
								$3
							)
						)
	}
	| variable_declaration SEMICOLON {
		$$ = $1;
	}
	| special_declaration SEMICOLON {
		$$ = $1;
	}
	;

variable_declaration :
  primitive_type variable_declarators
	{
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column, $1, $2);
  }
	| name variable_declarators
	{
		if($1.value.toLowerCase() === 'string')
			$1.changeType("STRING");
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column, $1, $2);
	}
	| array_type variable_declarators {
		$$ = new AST("VAR_DECLARATION", null, @1.first_line, @1.first_column, $1, $2);
	}
	;

special_declaration :
	modifiers variable_declarator_id PEQ expression {
		$$ = new AST("VAR_DECLARATION_NO_TYPE", null, @1.first_line, @1.first_column,
					$1,
					new AST("EQ", null, @3.first_line, @3.first_column,
						$2,
						$4
					)
				);
	}
	;

/* statements */

statement :
	statement_without_trailing_substatement {
    $$ = $1;
	}
	|	if_then_statement {
    $$ = $1;
	}
	|	if_then_else_statement {
    $$ = $1;
	}
	|	while_statement {
    $$ = $1;
	}
	|	for_statement {
    $$ = $1;
	}
	;

statement_without_trailing_substatement :
	block {
    $$ = $1;
	}
	|	empty_statement {
    $$ = $1;
	}
	|	expression_statement {
    $$ = $1;
	}
	|	switch_statement {
    $$ = $1;
	}
	|	do_statement {
    $$ = $1;
	}
	|	break_statement {
    $$ = $1;
	}
 	|	continue_statement {
     $$ = $1;
  }
	|	return_statement {
    $$ = $1;
	}
	|	throw_statement {
    $$ = $1;
	}
	|	try_statement {
    $$ = $1;
	}
	;

if_then_statement :
	IF LPAREN expression RPAREN statement {
    $$ = new AST('IF', null, @1.first_line, @1.first_column, $3, $5);
	}
	;

if_then_else_statement :
		IF LPAREN expression RPAREN statement
			ELSE statement {
    $$ = new AST('IF', null, @1.first_line, @1.first_column, $3, $5, $7);
	}
	;

while_statement :
	WHILE LPAREN expression RPAREN statement {
    $$ = new AST('WHILE', null, @1.first_line, @1.first_column, $3, $5);
	}
	;

for_statement :
	FOR LPAREN for_init SEMICOLON expression SEMICOLON
		for_update RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $3, new AST("FOR_COND",null,@5.first_line,@5.first_column,$5), $7, $9);
    $$.info = [true, true, true];
	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		 for_update RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, new AST("FOR_COND",null,@4.first_line,@4.first_column,$4), $6, $8);
    $$.info = [false, true, true];
	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		for_update RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $3, $6, $8);
    $$.info = [true, false, true];
	}
	| FOR LPAREN SEMICOLON SEMICOLON
		for_update RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $3, $5, $8);
    $$.info = [false, false, true];
	}
	| FOR LPAREN for_init SEMICOLON expression SEMICOLON
		RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $3, new AST("FOR_COND",null,@5.first_line,@5.first_column,$5), $8);
    $$.info = [true, true, false];
	}
	| FOR LPAREN SEMICOLON expression SEMICOLON
		RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, new AST("FOR_COND",null,@4.first_line,@4.first_column,$4), $7);
    $$.info = [false, true, false];
	}
	| FOR LPAREN for_init SEMICOLON SEMICOLON
		RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $3, $7);
    $$.info = [true, false, false];
	}
	| FOR LPAREN SEMICOLON SEMICOLON
		RPAREN statement {
    $$ = new AST('FOR', null, @1.first_line, @1.first_column, $6);
    $$.info = [false, false, false];
	}
	;


for_init : statement_expression_list {
		$$ = new AST("FOR_INIT",null,@1.first_line, @1.first_column, $1);
	}
	|	variable_declaration EQ expression {
			$$ = new AST("FOR_INIT",null,@1.first_line, @1.first_column, $1);
			let tt = $1.deleteAt(1);
			$1.addChild(
								new AST("EQ",null,@1.first_line,@1.first_column,
								tt[0],
								$3
							)
						);
	}
	;

for_update :	statement_expression_list {
    $$ = new AST("FOR_UPDATE",null,@1.first_line, @1.first_column, $1);
	}
	;

statement_expression_list :
	statement_expression {
    $$ = new AST("STMT_LIST", null, @1.first_line,@1.first_column, $1);
	}
	|	statement_expression_list COMMA statement_expression {
    $$ = $1;
    $$.addChild($3);
	}
	;


throw_statement :
	THROW expression SEMICOLON {
    $$ = new AST("THROW", null, @1.first_line,@1.first_column, $2);
	}
	;

try_statement :
	TRY block catches {
    $$ = new AST("TRY", null, @1.first_line, @1.first_column, $2, $3);
  }
	;

catches :	catch_clause {
    $$ = new AST("CATCH-LIST", null, @1.first_line, @1.first_column, $1);
	}
	|	catches catch_clause {
    $$ = $1;
    $$.addChild($2);
	}
	;

catch_clause :
	CATCH LPAREN formal_parameter RPAREN block {
    $$ = new AST("CATCH", null, @1.first_line, @1.first_column,
            $3,
						$5
        )
	}
	;

statement_expression :
	expression {
    $$ = $1;
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
    $$ = new AST('EXPRESSION_LIST',null,@1.first_line,@1.first_column,$1);
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
    $$ = new AST("RETURN", null, @1.first_line, @1.first_column,$2);
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
    $2.grouped = true
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
    $$ = new AST("NEW", null, @1.first_line, @1.first_column, $2);
	}
	;


argument_list :
	expression {
    $$ = new AST('EXPRESSION_LIST',null,@1.first_line,@1.first_column,$1);
	}
  | DOLLAR IDENTIFIER {
    $$ = new AST('EXPRESSION_LIST',null,@1.first_line,@1.first_column,
          new AST("DOLLAR",null,@1.first_line, @1.first_column,
              new AST("IDENTIFIER", $2, @2.first_line, @2.first_column)
            )
        );
  }
	|	argument_list COMMA expression {
    $$ = $1;
		$$.addChild($3);
	}
  |	argument_list COMMA DOLLAR IDENTIFIER {
    $$ = $1;
		$$.addChild(new AST("DOLLAR",null,@3.first_line, @3.first_column,
                              new AST("IDENTIFIER", $4, @4.first_line, @4.first_column)
                            )
                    );
	}
	;

array_creation_expression :
	NEW primitive_type dim_exprs {
    $$ = new AST("NEW_ARRAY", null, @1.first_line, @1.first_column, $2, $3);
	}
	|	NEW name dim_exprs {
    $$ = new AST("NEW_ARRAY", null, @1.first_line, @1.first_column, $2, $3);
	}
  | array_initializer {
    $$ = $1;
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
	|	primary DOT IDENTIFIER LPAREN argument_list RPAREN {
			$$ = new AST("FUNCTION_CALL",null,@3.first_line,@3.first_column,
				new AST("DOT", null, @2.first_line, @2.first_column,
					$1,
					new AST("IDENTIFIER",$3,@3.first_line,@3.first_column)
				),
				$5
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

cast_expression :
	LPAREN primitive_type RPAREN unary_expression {
    $$ = new AST("CAST", null, @1.first_line, @1.first_column, $2, $4);
	}
	|	LPAREN expression RPAREN unary_expression_not_plus_minus {
		if($2.getType() === tree_types.types.IDENTIFIER){
			if($2.getValue() === "string")
				$2.changeType("STRING")
		}
    $$ = new AST("CAST", null, @1.first_line, @1.first_column, $2, $4);
	}
	|	LPAREN array_type RPAREN unary_expression_not_plus_minus {
    $$ = new AST("CAST", null, @1.first_line, @1.first_column, $2, $4);
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

power_expression :
  unary_expression {
    $$ = $1;
  }
  | power_expression POT unary_expression {
    /* FIX THE RECURSION */
    $$ = new AST("POW", null, @2.first_line,@2.first_column);

    //we check for lhs (if lhs type == ^) we must rotate
    if($1.getType() == tree_types.types.POW && !$1.grouped){
          let tmp = $1.deleteAt(1)[0];
          $$.addChild(tmp);
          $$.addChild($3);
          $1.addChild($$);
          $$ = $1;
    }else{
			$$.addChild($1,$3);
		}
  }
  ;

multiplicative_expression :
	power_expression {
    $$ = $1;
	}
	|	multiplicative_expression MULT power_expression {
    $$ = new AST("MULT", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	multiplicative_expression DIV power_expression {
    $$ = new AST("DIV", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	multiplicative_expression MOD power_expression {
    $$ = new AST("MOD", null, @2.first_line,@2.first_column, $1,$3);
	}
	;

additive_expression :
	multiplicative_expression {
    $$ = $1;
	}
	|	additive_expression PLUS multiplicative_expression {
    $$ = new AST("PLUS", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	additive_expression MINUS multiplicative_expression {
    $$ = new AST("MINUS", null, @2.first_line,@2.first_column, $1,$3);
	}
	;

relational_expression :
	additive_expression {
    $$ = $1;
	}
	|	relational_expression LT additive_expression {
    $$ = new AST("LT", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	relational_expression GT additive_expression {
    $$ = new AST("GT", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	relational_expression LTEQ additive_expression {
    $$ = new AST("LTEQ", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	relational_expression GTEQ additive_expression {
    $$ = new AST("GTEQ", null, @2.first_line,@2.first_column, $1,$3);
	}
	;

equality_expression :
	relational_expression {
    $$ = $1;
	}
	|	equality_expression EQEQ relational_expression {
    $$ = new AST("EQEQ", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	equality_expression REQEQ relational_expression {
    $$ = new AST("REQEQ", null, @2.first_line,@2.first_column, $1,$3);
	}
	|	equality_expression NOTEQ relational_expression {
    $$ = new AST("NOTEQ", null, @2.first_line,@2.first_column, $1,$3);
	}
	;

exclusive_or_expression :
	equality_expression {
    $$ = $1;
	}
	|	exclusive_or_expression XOR equality_expression {
    $$ = new AST("XOR", null, @2.first_line,@2.first_column, $1,$3);
  }
	;

conditional_and_expression :
	exclusive_or_expression {
    $$ = $1;
	}
	|	conditional_and_expression ANDAND exclusive_or_expression {
    $$ = new AST("ANDAND", null, @2.first_line,@2.first_column, $1,$3);
	}
	;
conditional_or_expression :
	conditional_and_expression {
    $$ = $1;
	}
	|	conditional_or_expression OROR conditional_and_expression {
    $$ = new AST("OROR", null, @2.first_line,@2.first_column, $1,$3);
	}
	;
conditional_expression :
	conditional_or_expression {
    $$ = $1;
	}
	|	conditional_or_expression QUESTION expression
			COLON conditional_expression {
    $$ = new AST("QUESTION", null, @2.first_line,@2.first_column, $1,$3,$5);
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

assignment :	left_hand_side EQ assignment_expression {
	  $$ = new AST("EQ",null,@2.first_line, @2.first_column,$1,$3);
	}
	| name EQ assignment_expression {
    $$ = new AST("EQ",null,@2.first_line, @2.first_column, $1,$3);
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

