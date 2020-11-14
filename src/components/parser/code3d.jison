%{
//importaciones
	import { AstNode } from "./ast/ast-node.js";
	export var Root = null;
%}
%lex
%options flex case-insensitive
%%
\s+                                 /* skip whitespace */;
\/\/[^\n]*                          /*skip comment*/;

"\"%.2f\""  									return "parameter";
"E"												return 'E'
[l][0-9]+             							return 'label';
[t][0-9]+										return 'tmp';
[0-9]+("."[0-9]+)?\b  							return 'number'
"call"											return 'call';
"H"												return 'hp';
"P"												return 'sp';
"Heap"											return 'heap';
"Stack"											return 'stack';
"if"											return 'if';
"="												return 'eq';
","												return 'comma';
";"												return 'puntoycoma';
"+"												return "plus";
"-"												return "min";
"/"												return "div";
"\"%c\""										return "parameter";
"\"%d\""										return "parameter";
"%"												return "mod";
"*"												return "mult";
"goto"											return "goto";
"proc"											return 'proc'
"fmod"											return 'fmod'
"=="											return "gotoeq";
"!="											return "gotoneq";
">"												return "gotogt";
"<"												return "gotolt";
">="											return "gotogte";
"<="											return "gotolte";
"void"											return "void";
"int"											return "cast";
"double"											return "cast";
"return"											return "return";
"["												return "squarel";
"]"												return "squarer";
"{"												return "llaveabre";
"}"												return "llavecierra";
"llaveabre"												return "squarel";
"llavecierra"												return "squarer";
"printf"											return "printf";
"("												return 'lpar';
")"												return 'rpar';
":"												return 'colon';
[_A-Za-z][_A-Za-z0-9]*		return 'identifier';
.                         return 'invalid';
<<EOF>>                   return 'EOF';
/lex

%start INICIO
%%

INICIO
	: STMT_LIST EOF
        {
			Root = $1;
            $$ = $1;
        }
    ;

STMT_LIST
	: STMT_LIST STMT
		{
			$1.setNext($2);
		}
	| STMT
		{
			$$ = $1;
		}
	;

STMT
	:CALL_STMT puntoycoma {
		$$ = $1;
	}
	| TMP_STMT puntoycoma{
		$$ = $1;
	}
	| JMP_STMT puntoycoma{
		$$ = $1;
	}
	| HEAP_STMT puntoycoma{
		$$ = $1;
	}
	| STACK_STMT puntoycoma{
		$$ = $1;
	}
	| PRINT_STMT puntoycoma{
		$$ = $1;
	}
	| METHOD_DECL_STMT {
		$$ = $1;
	}
	| LABEL_STMT {
		$$ = $1;
	}
	| DECL_STMT puntoycoma{
		$$ = $1;
	}
	;


DECL_STMT
	: cast sp  {
		$$ = new AstNode("var",null, @1.first_line,@1.first_column,
						new AstNode("sp", null, @2.first_line,@2.first_column)
						);
	}
	| cast E  {
		$$ = new AstNode("var",null, @1.first_line,@1.first_column,
						new AstNode("e", null, @2.first_line,@2.first_column)
						);
	}
	| cast hp  {
			$$ = new AstNode("var",null, @1.first_line,@1.first_column,
						new AstNode("hp", null, @2.first_line,@2.first_column)
					);
	}
	| cast TMP_LIST {
		$$ = new AstNode("var",null, @1.first_line,@1.first_column);
		$2.forEach(el=>$$.addChild(el));
	}
	| cast heap squarel number squarer {
			$$ = new AstNode("var",null, @1.first_line,@1.first_column,
					new AstNode("heap",null,@2.first_line, @2.first_column)
				);
	}
	| cast stack squarel number squarer {
			$$ = new AstNode("var",null, @3.first_line,@3.first_column,
				new AstNode("stack",null,@2.first_line, @2.first_column)
			);
	}
	;

TMP_LIST
	: TMP_LIST comma tmp {
		$$ = $1;
		$$.push(new AstNode("tmp", $3, @3.first_line, @3.first_column));
	}
	| tmp {
		$$ = [
			new AstNode("tmp", $1, @1.first_line, @1.first_column)
		]
	}
	;

LABEL_STMT
	: label comma LABEL_STMT
	{
		$1.next = new AstNode("label",$3,@3.first_line, @3.first_column);
		$$ = $1;
	}
	| label colon
	{
		$$ = new AstNode("label", $1, @1.first_line, @1.first_column);
	}
	;

CALL_STMT
	: identifier 'lpar' 'rpar' {
		$$ = new AstNode("call", $1, @1.first_line, @1.first_column );
	}
	;

TMP_STMT
	: tmp eq tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("tmp", $3, @3.first_line,@3.first_column)
						);
	}
	| tmp eq number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("number", parseFloat($3), @3.first_line,@3.first_column)
						);
	}
	//inicio
	|  tmp eq sp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("sp", null, @3.first_line,@3.first_column)
						);
	}
	| tmp eq hp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("hp", null, @3.first_line,@3.first_column)
						);
	}
	//we begin stack access
	| 	tmp eq 	stack squarel number squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("number",parseFloat($5),@5.first_line, @5.first_column)
					)
				);

	}
	| tmp eq stack 	squarel tmp	squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("tmp", $5, @5.first_line, @5.first_column)
					)
				);

	}
	| 	tmp eq 	stack squarel sp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("sp", null, @5.first_line, @5.first_column)
					)
				);

	}

	| 	tmp eq 	stack squarel lpar cast rpar number squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("number",parseFloat($8),@8.first_line, @8.first_column)
					)
				);

	}
	| tmp eq stack 	squarel lpar cast rpar tmp	squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("tmp", $8, @8.first_line, @8.first_column)
					)
				);

	}
	| 	tmp eq 	stack squarel lpar cast rpar sp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("stack",null,@3.first_line, @3.first_column,
						new AstNode("sp", null, @8.first_line, @8.first_column)
					)
				);

	}
	// fin de stack access
	| tmp eq heap squarel number squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("number",parseFloat($5),@5.first_line, @5.first_column)
					)
				);

	}
	| tmp eq heap squarel tmp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("tmp", $5, @5.first_line, @5.first_column)
					)
				);

	}
	| tmp eq heap squarel hp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("hp", null, @5.first_line, @5.first_column)
					)
				);

	}



	| tmp eq heap squarel lpar cast rpar number squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("number",parseFloat($8),@8.first_line, @8.first_column)
					)
				);

	}
	| tmp eq heap squarel lpar cast rpar tmp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("tmp", $8, @8.first_line, @8.first_column)
					)
				);

	}
	| tmp eq heap squarel lpar cast rpar hp squarer
	{
		$$ = new AstNode("=", null, @2.first_line,@2.first_column,
					new AstNode("tmp",$1, @1.first_line, @1.first_column),
					new AstNode("heap",null,@3.first_line, @3.first_column,
						new AstNode("hp", null, @8.first_line, @8.first_column)
					)
				);

	}
	//fin de heap access
	| tmp eq number OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($3), @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| tmp eq number OPERATOR tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($3), @3.first_line,@3.first_column),
							new AstNode("tmp", $5, @5.first_line,@5.first_column)
							)
						);
	}
	//fix
	| tmp eq tmp OPERATOR tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("tmp", $3, @3.first_line,@3.first_column),
							new AstNode("tmp", $5, @5.first_line,@5.first_column)
							)
						);
	}
	| tmp eq tmp OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("tmp", $3, @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column),
							)
						);
	}
	//fin fix
	| tmp eq sp OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| tmp eq number OPERATOR sp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($3), @3.first_line,@3.first_column),
							new AstNode("sp", null, @5.first_line,@5.first_column)
							)
						);
	}
	| tmp eq hp OPERATOR number
	{
		$$ = new AstNode("=",null, @1.first_line,@1.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| tmp eq number OPERATOR hp
	{
		$$ = new AstNode("=",null, @1.first_line,@1.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($3), @3.first_line,@3.first_column),
							new AstNode("hp", null, @5.first_line,@5.first_column)
							)
						);
	}

	//----------------------------------modulo

	| tmp eq fmod lpar number comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| tmp eq fmod lpar number comma tmp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column),
							new AstNode("tmp", $7, @7.first_line,@7.first_column)
							)
						);
	}
	//fix
	| tmp eq fmod lpar tmp comma tmp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("tmp", $5, @5.first_line,@5.first_column),
							new AstNode("tmp", $7, @7.first_line,@7.first_column)
							)
						);
	}
	| tmp eq fmod lpar tmp comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("tmp", $5, @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column),
							)
						);
	}
	//fin fix
	| tmp eq fmod lpar sp comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| tmp eq fmod lpar number comma sp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column),
							new AstNode("sp", null, @7.first_line,@7.first_column)
							)
						);
	}
	| tmp eq fmod lpar hp comma number rpar
	{
		$$ = new AstNode("=",null, @1.first_line,@1.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| tmp eq fmod lpar number comma hp rpar
	{
		$$ = new AstNode("=",null, @1.first_line,@1.first_column,
						new AstNode("tmp", $1, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column),
							new AstNode("hp", null, @7.first_line,@7.first_column)
							)
						);
	}
	;

ERROR_ASSIGN
: E eq number
{
	$$ = new AstNode("=",null,@2.first_line,@2.first_column,
				new AstNode("E",null, @1.first_line,@1.first_column),
				new AstNode("number", parseFloat(number), @3.first_line, @3.first_column)
			)
}
;

OPERATOR
	: plus
	{
		$$ = $1;
	}
	| min
	{
		$$ = $1;
	}
	| div
	{
		$$ = $1;
	}
	| mod
	{
		$$ = $1;
	}
	| mult
	{
		$$ = $1;
	}
	;

HEAP_STMT
	: 	heap squarel tmp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("number", parseFloat($6), @6.first_line, @6.first_column)
				);
	}
	| 	heap squarel hp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@3.first_line, @3.first_column)
					),
					new AstNode("number", parseFloat($6), @6.first_line, @6.first_column)
				);
	}
	|	heap squarel tmp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("tmp", $6, @6.first_line, @6.first_column)
				);
	}
	| 	heap squarel hp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@3.first_line, @3.first_column)
					),
					new AstNode("tmp", $6, @6.first_line, @6.first_column)
				);
	}




	| heap squarel lpar cast rpar tmp squarer eq number
	{
		$$ = new AstNode("=", null, @8.first_line,@8.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("number", parseFloat($9), @9.first_line, @9.first_column)
				);
	}
	| 	heap squarel lpar cast rpar hp squarer eq number
	{
		$$ = new AstNode("=", null, @8.first_line,@8.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@6.first_line, @6.first_column)
					),
					new AstNode("number", parseFloat($9), @9.first_line, @9.first_column)
				);
	}
	|	heap squarel lpar cast rpar tmp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("tmp", $9, @9.first_line, @9.first_column)
				);
	}
	| 	heap squarel lpar cast rpar hp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@6.first_line, @6.first_column)
					),
					new AstNode("tmp", $9, @9.first_line, @9.first_column)
				);
	}
	// inicio duplicado
	|	heap squarel tmp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("hp",null, @6.first_line, @6.first_column)
				);
	}
	| 	heap squarel hp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@3.first_line, @3.first_column)
					),
					new AstNode("hp", null, @6.first_line, @6.first_column)
				);
	}
	|	heap squarel tmp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("sp", null, @6.first_line, @6.first_column)
				);
	}
	| 	heap squarel hp squarer eq  sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@3.first_line, @3.first_column)
					),
					new AstNode("sp", null, @6.first_line, @6.first_column)
				);
	} 
	
	
	
	|	heap squarel lpar cast rpar tmp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("hp",null, @9.first_line, @9.first_column)
				);
	}
	| 	heap squarel lpar cast rpar hp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@6.first_line, @6.first_column)
					),
					new AstNode("hp", null, @9.first_line, @9.first_column)
				);
	}
	|	heap squarel lpar cast rpar tmp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("sp", null, @9.first_line, @9.first_column)
				);
	}
	| 	heap squarel lpar cast rpar hp squarer eq  sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("heap",null,@1.first_line, @1.first_column,
						new AstNode("hp",null,@6.first_line, @6.first_column)
					),
					new AstNode("sp", null, @9.first_line, @9.first_column)
				);
	} 
	//fin duplicado
	| 	hp eq hp OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("hp", null, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| 	hp eq hp OPERATOR tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("hp", null, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @3.first_line,@3.first_column),
							new AstNode("tmp", $5, @5.first_line,@5.first_column)
							)
						);
	}


	| 	hp eq fmod lpar hp comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("hp", null, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| 	hp eq fmod lpar hp comma tmp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("hp", null, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("hp", null, @5.first_line,@5.first_column),
							new AstNode("tmp", $7, @7.first_line,@7.first_column)
							)
						);
	}
	;

STACK_STMT
	: stack squarel	tmp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("number",parseFloat($6),@6.first_line, @6.first_column)
				);

	}
	|	stack squarel tmp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("tmp", $6, @6.first_line, @6.first_column)
				);
	}
	|	stack squarel sp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@3.first_line, @3.first_column)
					),
					new AstNode("tmp", $6,@6.first_line, @6.first_column)
				);
	}
	| 	stack squarel sp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@3.first_line, @3.first_column)
					),
					new AstNode("number", parseFloat($6),@6.first_line, @6.first_column)
				);
	}



	| stack squarel	lpar cast rpar tmp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("number",parseFloat($9),@9.first_line, @9.first_column)
				);

	}
	|	stack squarel lpar cast rpar tmp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("tmp", $9, @9.first_line, @9.first_column)
				);
	}
	|	stack squarel lpar cast rpar sp squarer eq tmp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@6.first_line, @6.first_column)
					),
					new AstNode("tmp", $9,@9.first_line, @9.first_column)
				);
	}
	| 	stack squarel lpar cast rpar sp squarer eq number
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@6.first_line, @6.first_column)
					),
					new AstNode("number", parseFloat($9),@9.first_line, @9.first_column)
				);
	}
	//inicio de duplicado
	|	stack squarel tmp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("sp",null,@6.first_line, @6.first_column)
				);

	}
	|	stack squarel tmp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$3,@3.first_line, @3.first_column)
					),
					new AstNode("hp", null, @6.first_line, @6.first_column)
				);
	}
	| 	stack squarel sp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@3.first_line, @3.first_column)
					),
					new AstNode("sp", null ,@6.first_line, @6.first_column)
				);
	}
	| 	stack squarel sp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@3.first_line, @3.first_column)
					),
					new AstNode("hp", null,@6.first_line, @6.first_column)
				);
	} // fin duplicado



	|	stack squarel lpar cast rpar tmp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("sp",null,@9.first_line, @9.first_column)
				);

	}
	|	stack squarel lpar cast rpar tmp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("tmp",$6,@6.first_line, @6.first_column)
					),
					new AstNode("hp", null, @9.first_line, @9.first_column)
				);
	}
	| 	stack squarel lpar cast rpar sp squarer eq sp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@6.first_line, @6.first_column)
					),
					new AstNode("sp", null ,@9.first_line, @9.first_column)
				);
	}
	| 	stack squarel lpar cast rpar sp squarer eq hp
	{
		$$ = new AstNode("=", null, @5.first_line,@5.first_column,
					new AstNode("stack",null,@1.first_line, @1.first_column,
						new AstNode("sp",null,@6.first_line, @6.first_column)
					),
					new AstNode("hp", null,@9.first_line, @9.first_column)
				);
	} 




	| 	sp eq hp OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
							new AstNode("sp", null, @1.first_line,@1.first_column),
							new AstNode($4, null, @4.first_line,@4.first_column,
								new AstNode("hp", null, @3.first_line,@3.first_column),
								new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| 	sp eq hp OPERATOR tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line, @4.first_column,
							new AstNode("hp", null, @3.first_line,@3.first_column),
							new AstNode("tmp", $5, @5.first_line,@5.first_column)
							)
						);
	}
	| 	sp eq sp OPERATOR number
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @3.first_line,@3.first_column),
							new AstNode("number", parseFloat($5), @5.first_line,@5.first_column)
							)
						);
	}
	| 	sp eq sp OPERATOR tmp
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode($4, null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @3.first_line,@3.first_column),
							new AstNode("tmp", $5, @5.first_line,@5.first_column)
							)
						);
	}




	| 	sp eq fmod lpar hp comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
							new AstNode("sp", null, @1.first_line,@1.first_column),
							new AstNode("%", null, @4.first_line,@4.first_column,
								new AstNode("hp", null, @5.first_line,@5.first_column),
								new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| 	sp eq fmod lpar hp comma tmp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line, @4.first_column,
							new AstNode("hp", null, @5.first_line,@5.first_column),
							new AstNode("tmp", $7, @7.first_line,@7.first_column)
							)
						);
	}
	| 	sp eq fmod lpar sp comma number rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @5.first_line,@5.first_column),
							new AstNode("number", parseFloat($7), @7.first_line,@7.first_column)
							)
						);
	}
	| 	sp eq fmod lpar sp comma tmp rpar
	{
		$$ = new AstNode("=",null, @2.first_line,@2.first_column,
						new AstNode("sp", null, @1.first_line,@1.first_column),
						new AstNode("%", null, @4.first_line,@4.first_column,
							new AstNode("sp", null, @5.first_line,@5.first_column),
							new AstNode("tmp", $7, @7.first_line,@7.first_column)
							)
						);
	}
	;

	JMP_STMT
	: goto label
	{
		$$ = new AstNode($1,
						 $2,
						 @1.first_line,
						 @1.first_column);

	}
	| IFINIT lpar number GOTO_OP tmp rpar goto label
	{
		$$ = new AstNode($4,
						 $8,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("number",parseFloat($3), @3.first_line, @3.first_column),
						 new AstNode("tmp", $5, @5.first_line, @5.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT number GOTO_OP tmp goto label
	{
		$$ = new AstNode($3,
						 $6,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("number",parseFloat($2), @2.first_line, @2.first_column),
						 new AstNode("tmp", $4, @5.first_line, @4.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT lpar tmp GOTO_OP number rpar goto label
	{
		$$ = new AstNode($4,
						 $8,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("tmp",$3, @3.first_line, @3.first_column),
						 new AstNode("number", parseFloat($5), @5.first_line, @5.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT tmp GOTO_OP number goto label
	{
		$$ = new AstNode($3,
						 $6,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("tmp",$2, @2.first_line, @2.first_column),
						 new AstNode("number", parseFloat($4), @4.first_line, @4.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT lpar tmp GOTO_OP tmp rpar goto label
	{
		$$ = new AstNode($4,
						 $8,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("tmp",$3, @3.first_line, @3.first_column),
						 new AstNode("tmp", $5, @5.first_line, @5.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT tmp GOTO_OP tmp goto label
	{
		$$ = new AstNode($3,
						 $6,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("tmp",$2, @2.first_line, @2.first_column),
						 new AstNode("tmp", $4, @4.first_line, @4.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT lpar number GOTO_OP number rpar goto label
	{
		$$ = new AstNode($4,
						 $8,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("number", parseFloat($3), @3.first_line, @3.first_column),
						 new AstNode("number", parseFloat($5), @5.first_line, @5.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	| IFINIT number GOTO_OP number goto label
	{
		$$ = new AstNode($3,
						 $6,
						 @1.first_line,
						 @1.first_column,
						 new AstNode("number", parseFloat($2), @2.first_line, @2.first_column),
						 new AstNode("number", parseFloat($4), @4.first_line, @4.first_column)
						);
		if($1 === true) $$.converToFalse()
	}
	;

	IFINIT
	: if
	{
		$$ = false
	}
	;
	/*
		HACER EL IFFLASE
	*/

	GOTO_OP
	: gotoeq
	{
		$$ = $1;
	}
	| gotoneq
	{
		$$ = $1;
	}
	| gotogt
	{
		$$ = $1;
	}
	| gotogte
	{
		$$ = $1;
	}
	| gotolt
	{
		$$ = $1;
	}
	| gotolte
	{
		$$ = $1;
	}
	;

PRINT_STMT
	: printf lpar parameter comma tmp rpar
	{
		$$ = new AstNode($1, $3, @1.first_line, @1.first_column,
				new AstNode("tmp", $5, @5.first_line, @5.first_column)
			);
	}
	| printf lpar parameter comma lpar cast rpar tmp rpar
	{
		$$ = new AstNode($1, $3, @1.first_line, @1.first_column,
				new AstNode("tmp", $8, @8.first_line, @8.first_column)
			);
	}
	| printf lpar parameter comma number rpar
	{
		$$ = new AstNode($1, $3, @1.first_line, @1.first_column,
				new AstNode("number", parseFloat($5), @5.first_line, @5.first_column)
			);
	}
	| printf lpar parameter comma lpar cast rpar number rpar
	{
		$$ = new AstNode($1, $3, @1.first_line, @1.first_column,
				new AstNode("number", parseFloat($8), @8.first_line, @8.first_column)
			);
	}
	;

METHOD_DECL_STMT
	:  void identifier lpar rpar llaveabre STMT_LIST "return" puntoycoma llavecierra
	{
		let begin_node = new AstNode("begin",null,@3.first_line, @3.first_column);
		begin_node.setNext($6);
		begin_node.setNext(new AstNode("end",null,@5.first_line, @5.first_column));
		$$ = new AstNode("method", $2, @2.first_line, @2.first_column, begin_node);
	}
	| cast identifier lpar rpar llaveabre STMT_LIST "return" puntoycoma llavecierra
	{
		let begin_node = new AstNode("begin",null,@3.first_line, @3.first_column);
		begin_node.setNext($6);
		begin_node.setNext(new AstNode("end",null,@5.first_line, @5.first_column));
		$$ = new AstNode("method", $2, @2.first_line, @2.first_column, begin_node);
	}
	;

%%
