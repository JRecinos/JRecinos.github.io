%{
import {NodoMM} from "../tree/NodoMM";
import {Expresion} from "../tree/Expresion";
import {Relacional} from "../tree/Relacional";
import {Condicional} from "../tree/Condicional";
import {Imprimir} from "../tree/Imprimir";
import {GraficarTS} from "../tree/GraficarTS";
import {Sentencias} from "../tree/Sentencias";
import {Declaracion} from "../tree/Declaracion";
import {DeclaFuncion} from "../tree/DeclaFuncion";
import {Recursivo} from "../tree/Recursivo";
import {Asignacion} from "../tree/Asignacion";
import {ExpArrayNew} from "../tree/ExpArrayNew";
import {ExpArray} from "../tree/ExpArray";
import {ExpLlamadaFuncion} from "../tree/ExpLlamadaFuncion";
import {DefObj} from "../tree/DefObj";
import {ExpObjeto } from "../tree/ExpObjeto";
import {SentIF} from "../tree/SentIF";
import {SentWHILE} from "../tree/SentWHILE";
import {SentDO} from "../tree/SentDO";
import {SentSWITCH} from "../tree/SentSWITCH";
import {SentFOR} from "../tree/SentFOR";
import {SentBREAK} from "../tree/SentBREAK";
import {SentCONTINUE} from "../tree/SentCONTINUE";
import {SentRETURN} from "../tree/SentRETURN";
import {ExpTernario} from "../tree/ExpTernario";
import { plantillaError } from "../utilities/plantillaError";
  /*
  if (hash["token"] == "INVALID") {
          window.errores.push(
            new plantillaError(
              "Lexico",
              "Lexema: " + hash["text"] + ", no reconocido.",
              hash["loc"]["last_line"],
              hash["loc"]["last_column"]
            )
          );
        } else {
          window.errores.push(
            new plantillaError(
              "Sintactico",
              "Error en: " +
                hash["text"] +
                ", se esperaba " +
                hash["expected"] +
                ".",
              hash["loc"]["last_line"],
              hash["loc"]["last_column"]
            )
          );
        }

   */
%}


%lex
%options ranges

%s                                  comment
%%

\s+                                 /* skip whitespace */;
\/\/[^\n]*                          /*skip comment*/;
"/*"                                this.begin('comment');
<comment>"*/"                       this.popState();
<comment>.                          /* skip comment content*/



\s+                                 /* skip whitespace */

[0-9]+("."[0-9]+)                   return 'DECIMAL';
("0"|[0-9]+)                        return 'ENTERO';


"%"                                 return '%';
"++"                                return 'masmas';
"**"                                return 'potencia';
"--"                                return 'menosmenos';
"=="                                return 'igualigual';
"!="                                return 'diferente';
">="                                return 'mayoroigual';
"<="                                return 'menoroigual';
">"                                 return 'mayor';
"<"                                 return 'menor';
"?"                                 return 'pregunta';
":"                                 return 'dospuntos';
"&&"                                return 'and';
"||"                                return 'or';
"="                                 return 'igual';
"!"                                 return 'not';
"-"                                 return '-';
"+"                                 return '+';
"%"                                 return '%';
"*"                                 return '*';
"/"                                 return '/';
"("                                 return 'parentesisabre';
")"                                 return 'parentesiscierra';
"{"                                 return 'llaveabre';
"}"                                 return 'llavecierra';
"["                                 return 'corcheteabre';
"]"                                 return 'corchetecierra';
";"                                 return 'puntoycoma';
","                                 return 'coma';
"."                                 return 'punto';


"type"                              return 'type';
"if"                                return 'if';
"else"                              return 'else';
"console"                           return 'console';
"log"                               return 'log';
"while"                             return 'while';
"do"                                return 'do';
"return"                            return 'return';
"continue"                          return 'continue';
"break"                             return 'break';
"default"                           return 'default';
"case"                              return 'case';
"switch"                            return 'switch';
"true"                              return 'verdadero';
"false"                             return 'falso';
"double"                            return 'double';
"let"                               return 'let';
"const"                             return 'const';
"graficar_ts"                       return 'graficar_ts';
"for"                               return 'for';
"length"                            return 'length';
"null"                              return 'null';
"undefined"                         return 'undefined';
"push"                              return 'push';
"pop"                               return 'pop';
"function"                          return 'function';
"toUpperCase"                       return 'toUpperCase';
"toLowerCase"                       return 'toLowerCase';
"concat"                            return 'concat';
"new"                               return 'new';
"Array"                             return 'Array';
"in"                                return 'in';
"of"                                return 'of';

"\""(("\\\"")|[^"])*"\""            yytext = yytext.substr(1,yyleng-2);     return 'CADENA';
"'"(("\\'")|[^'])*"'"               yytext = yytext.substr(1,yyleng-2);     return 'CADENA';

("ñ"|"Ñ"|"_"|[a-zA-Z])("ñ"|"Ñ"|[a-zA-Z]|[0-9]|"_")* return 'IDENTIFICADOR';
<<EOF>>                             return 'EOF';
.                                   return 'INVALID';

/lex

/* operator associations and precedence */


%right  'igual'
%right  'pregunta' 'dospuntos'
%left   'or'
%left   'and'
%left   'xor'
%left   'igualigual' 'diferente'
%left   'menor' 'mayor' 'mayoroigual' 'menoroigual' 'instanceof'
%left   'igualigual' 'diferente'
%left   '+' '-'
%left   '*' '/' '%'
%left   '%' 'potencia' 
%right  'new' 'int' 'String' 'boolean' 'double'

%right  'not'
%left   UMINUS
%right  'masmas' 'menosmenos'
%nonassoc 'masmas' 'menosmenos'
%left   'parentesisabre' 'parentesiscierra'
%left   'punto'
%left  'corcheteabre' 'corchetecierra'

%start INICIO
%error-verbose
%%

INICIO: SENTENCIASF EOF
        {
            return $1;
        };

SENTENCIASF:
    SENTENCIASF SENTENCIAF
        {
            $1.hijos.push($2);
        }
    | SENTENCIAF    
        {
            $$ = new Sentencias ("SENTENCIAS", "SENTENCIAS", @1, [$1]);
        };

SENTENCIAS:
    SENTENCIAS SENTENCIA
        {
            $1.hijos.push($2);
            $$ = $1;
        }
    | SENTENCIA
        {
            $$ = new Sentencias ("SENTENCIAS","SENTENCIAS",@1 , [$1]);
        };

SENTENCIAF:
    SENTENCIA
        {
            $$ = $1;
        }
    | DECLAFUNCION
        {
            $$ = $1;
        };

SENTENCIA:
    IMPRIMIR
        {
            $$ = $1;
        }
    | DECLARACION 'puntoycoma'
        {
            $$ = $1;
        }
    | ASIGNACION 'puntoycoma'
        {
            $$ = $1;
        }
    | LISTARECURSIVA 'puntoycoma'
        {
            $$ = $1;
        }
    | DEFOBJETO
        {
            $$ = $1;
        }
    | SENTIF    
        {
            $$ = $1;
        }
    | SENTWHILE
        {
            $$ = $1;
        }
    | SENTDO
        {
            $$ = $1;
        }
    | SENTFOR
        {
            $$ = $1;
        }
    | SENTBREAK
        {
            $$ = $1;
        }
    | SENTCONTINUE
        {
            $$ = $1;
        }
    | SENTRETURN
        {
            $$ = $1;
        }
    | SENTSWITCH
        {
            $$ = $1;
        }
    | LLAMADAFUNCION 'puntoycoma'
        {
            $$ = $1;
        }
    ;



///////////////////////////////////////////////////////////////////////////// BLOQUE SENT

BLOQUESENT:
    'llaveabre' SENTENCIAS 'llavecierra'
        {
            $$ = $2;
        }
    | 'llaveabre' 'llavecierra'
        {
           $$ = new Sentencias ("SENTENCIAS","SENTENCIAS",[0,0], []);
        };

BLOQUESENTF:
    'llaveabre' SENTENCIASF 'llavecierra'
        {
            $$ = $2;
        };

 ///////////////////////////////////////////////////////////////////////////// ESCAPES

SENTBREAK:
    'break' 'puntoycoma'
        {
            $$ = new SentBREAK ("BREAK", "BREAK", @1, []);
        };    

SENTCONTINUE:
    'continue' 'puntoycoma'
        {
            $$ = new SentCONTINUE ("CONTINUE", "CONTINUE", @1, []);
        }; 

SENTRETURN:
    'return' 'puntoycoma'
        {
            $$ = new SentRETURN("RETURN", "RETURN", @1, []);
        }
    | 'return' COND 'puntoycoma'
        {
            $$ = new SentRETURN ("RETURN", "RETURN", @1, [$2]);
        }; 

//////////////////////////////////////////////////////////////////////////// DECLARACION FUNCION

DECLAFUNCION:
    'function' ID 'parentesisabre' LISTAPARAMS 'parentesiscierra' 'dospuntos' ID LISTADIMS BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, $4, $7, $8, $9]);
        }
    | 'function' ID 'parentesisabre' LISTAPARAMS 'parentesiscierra' 'dospuntos' ID BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, $4, $7, new NodoMM ("LISTADIMS", "LISTADIMS", @1, 0), $8]);
        }
    | 'function' ID 'parentesisabre' LISTAPARAMS 'parentesiscierra' BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, $4, new NodoMM ("ID", "void", @1, [] ) , new NodoMM ("LISTADIMS", "LISTADIMS", @1, 0), $6]);
        }
    | 'function' ID 'parentesisabre' 'parentesiscierra' 'dospuntos' ID LISTADIMS BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, new NodoMM ("LISTAPARAMS", "LISTAPARAMS", @1, []), $6, $7, $8]);
        }
    | 'function' ID 'parentesisabre' 'parentesiscierra' 'dospuntos' ID  BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, new NodoMM ("LISTAPARAMS", "LISTAPARAMS", @1, []), $6, new NodoMM ("LISTADIMS", "LISTADIMS", @1, 0), $7]);
        }
    | 'function' ID 'parentesisabre' 'parentesiscierra' BLOQUESENTF
        {
            $$ = new DeclaFuncion ("DECLAFUNCION", "DECLAFUNCION", @2, [$2, new NodoMM ("LISTAPARAMS", "LISTAPARAMS", @1, []), new NodoMM ("ID", "void", @1, [] ), new NodoMM ("LISTADIMS", "LISTADIMS", @1, 0), $5]);
        };
        //ID LISTAPARAMS
LISTAPARAMS: 
    LISTAPARAMS 'coma' PARAM
        {
            $1.hijos.push($3);
            $$ = $1;
        }
    | PARAM
        {

            $$ = new NodoMM ("LISTAPARAMS", "LISTAPARAMS", @1, [$1]);
        };

PARAM:
    ID 'dospuntos' ID
        {
            $$ = new NodoMM ("PARAM", "PARAM", @2, [$1, $3, new NodoMM ("LISTADIMS", "LISTADIMS", @1, 0)])
        }
    | ID 'dospuntos' ID LISTADIMS
        {
            $$ = new NodoMM ("PARAM", "PARAM", @2, [$1, $3, $4])
        };

LLAMADAFUNCION:
    ID 'parentesisabre' LISTAEXP 'parentesiscierra'
        {
            $$ = new ExpLlamadaFuncion ("LLAMADAFUNCION", "LLAMADAFUNCION", @1, [$1, $3]);
        }
    |ID 'parentesisabre' 'parentesiscierra'
        {
            $$ = new ExpLlamadaFuncion ("LLAMADAFUNCION", "LLAMADAFUNCION", @1, [$1, new NodoMM ("LISTAEXP", "LISTAEXP", @1, [])]);
        };

//////////////////////////////////////////////////////////////////////////// SENTENCIA TERNARIO

TERNARIO:
    COND 'pregunta' COND 'dospuntos' COND
        {
            $$ = new ExpTernario ("TERNARIO","TERNARIO",@1,[$1, $3, $5]);
        };

//////////////////////////////////////////////////////////////////////////// SENTENCIA SWITCH

SENTSWITCH:
    'switch' 'parentesisabre' COND 'parentesiscierra' BLOQUESWITCH
        {
            $$ = new SentSWITCH ("SWITCH","SWITCH",@3,[$3,$5]);
        };

BLOQUESWITCH:
    'llaveabre' LISTACASE 'default' 'dospuntos' SENTENCIAS 'llavecierra'
        {
            $$ = new SentSWITCH ("SWITCH","BLOQUESWITCH",@1,[$2,$5]);
        };

LISTACASE:
    LISTACASE CASE
        {
            $1.hijos.push($2);
            $$ = $1;
        }
    | CASE
        {
            let nodolistacase = new SentSWITCH ("LISTACASE","LISTACASE",@1,[$1]);
            $$ = nodolistacase;
        };

CASE:
    'case' COND 'dospuntos' SENTENCIAS
        {
            $$ = new SentSWITCH ("CASE","CASE",@1,[$2,$4]);
        };

//////////////////////////////////////////////////////////////////////////// SENTENCIA FOR
SENTFOR:
    'for' 'parentesisabre' FORINIT 'puntoycoma' COND 'puntoycoma' ASIGNACION 'parentesiscierra' BLOQUESENT
        {
            $$ = new SentFOR ("FOR","FOR",@1,[$3,$5,$7,$9]);
        }
    | 'for' 'parentesisabre' TIPOCAMBIO IDENTIFICADOR 'in' COND 'parentesiscierra' BLOQUESENT
        {
            $$ = new SentFOR ("FORIN","FORIN",@1,[$4,$6,$8]);
        }
    | 'for' 'parentesisabre' TIPOCAMBIO IDENTIFICADOR 'of' COND 'parentesiscierra' BLOQUESENT
        {
            $$ = new SentFOR ("FOROF","FOROF",@1,[$4,$6,$8]);
        };

FORINIT:
    DECLARACION
        {
            $$ = $1;
        }
    | ASIGNACION
        {
            $$ = $1;
        };
//////////////////////////////////////////////////////////////////////////// SENTENCIA WHILE
SENTWHILE:
    'while' 'parentesisabre' COND 'parentesiscierra' BLOQUESENT
        {
            $$ = new SentWHILE ("WHILE","WHILE",@1,[$3,$5]);
        };

SENTDO:
    'do' BLOQUESENT 'while' 'parentesisabre' COND 'parentesiscierra' 'puntoycoma'
        {
            $$ = new SentDO ("DO","DO",@1,[$5,$2]);
        };

//////////////////////////////////////////////////////////////////////////// SENTENCIA IF


SENTIF: IF_LIST 'else'  BLOQUESENT
        {
            let nodoelse = new SentIF("else","ELSE",@2,[$3]);
            $1.hijos.push(nodoelse);
            $$ = $1;
        }
    | IF_LIST
        {
            $$ = $1;
        };

IF_LIST: IF_LIST 'else' 'if' 'parentesisabre' COND 'parentesiscierra' BLOQUESENT
    {
        let nodoifelse = new SentIF("IFELSE","IFELSE",@1,[$5,$7]);
        $1.hijos.push(nodoifelse);
        $$ = $1;
    }
    | 'if' 'parentesisabre' COND 'parentesiscierra' BLOQUESENT
    {
        let nodoif = new SentIF("IF","IF",@1,[$3,$5]);
        $$ = new SentIF("IFMAESTRO","IFMAESTRO",@1,[nodoif]);
    };


///////////////////////////////////////////////DECLARACION////////////////////////////////////////////////
LISTADIMS:
    LISTADIMS 'corcheteabre' 'corchetecierra'
        {
            $1.hijos = $1.hijos+ 1;
            $$ = $1;
        }
    | 'corcheteabre' 'corchetecierra'
        {
            $$ = new NodoMM ("LISTADIMS", "LISTADIMS", @1, 1);
        };

TIPOCAMBIO:
    'const'
        {
            $$ = new NodoMM("const", "const", @1, []);
        }
    | 'let'
        {
            $$ = new NodoMM("let", "let", @1, []);
        };


DECLARACION:
    TIPOCAMBIO LISTADECLA 
        {
            $$ = new Declaracion ("DECLA", "DECLA", @1, [$1, $2]);
        };

LISTADECLA:
    LISTADECLA 'coma' DECLAELEMENT
        {
            $1.hijos.push($3);
            $$ = $1;
        }
    | DECLAELEMENT
        {
            $$ = new Declaracion ("LISTADECLA", "LISTADECLA", @1, [$1]);
        };


DECLAELEMENT:
    ID 'dospuntos' ID LISTADIMS igual COND
        {
            $$ = new Declaracion ("DECLAARR1", "DECLAELEMENT", @1, [$1, $3, $4, $6]);
        }
    | ID 'dospuntos' ID LISTADIMS 
        {
            $$ = new Declaracion ("DECLAARR2", "DECLAELEMENT", @1, [$1, $3, $4]);
        }
    | ID 'dospuntos' ID 'igual' COND 
        {
            $$ = new Declaracion ("DECLAVAR1", "DECLAELEMENT", @1, [$1, $3, $5]);
        }   
    | ID 'igual' COND
        {
            $$ = new Declaracion ("DECLAVAR2", "DECLAELEMENT", @1, [$1, $3]);
        }
    | ID 'dospuntos' ID
        {
            $$ = new Declaracion ("DECLAVAR3", "DECLAELEMENT", @1, [$1, $3]);
        } 
    | ID
        {
            $$ = new Declaracion ("DECLAVAR4", "DECLAELEMENT", @1, [$1]);
        };

///////////////////////////////////////////////OBJETOS////////////////////////////////////////////////////

DEFOBJETO:
    'type' ID 'igual' 'llaveabre' LISTAATRIBUTOS 'llavecierra' 'puntoycoma'
        {
            $$ = new DefObj ("DEFOBJ", "DEFOBJ", @2, [$2, $5]);
        };

LISTAATRIBUTOS:
    LISTAATRIBUTOS 'coma' ID 'dospuntos' ID LISTADIMS
        {
            $1.hijos.push(new NodoMM("ATTR", "ATTR", @1, [$3, $5, $6]));
            $$ = $1;
        }    
    | LISTAATRIBUTOS 'coma' ID 'dospuntos' ID
        {
            $1.hijos.push(new NodoMM("ATTR", "ATTR", @1, [$3, $5]));
            $$ = $1;
        }
    | ID 'dospuntos' ID LISTADIMS
        {
            $$ = new NodoMM("LATTR", "LATTR", @1, [
                new NodoMM("ATTR", "ATTR", @1, [$1, $3, $4])
            ]);
        }
    | ID 'dospuntos' ID 
        {
            $$ = new NodoMM("LATTR", "LATTR", @1, [
                new NodoMM("ATTR", "ATTR", @1, [$1, $3])
            ]);
        };

EXPOBJ:
    'llaveabre' LISTAATRIBUTOSDEF 'llavecierra'
        {
            $$ = $2;
        };

LISTAATRIBUTOSDEF:
    LISTAATRIBUTOSDEF 'coma' ID 'dospuntos' COND
        {
            $1.hijos.push(new NodoMM("ATTRDEF", "ATTRDEF", @1, [$3, $5]));
            $$ = $1;
        }
    | ID 'dospuntos' COND
        {
            $$ = new ExpObjeto("EXPOBJ", "EXPOBJ", @1, [
                new NodoMM("ATTR", "ATTR", @1, [$1, $3])
            ]);
        };
///////////////////////////////////////////////ASIGNACION///////////////////////////////////////////////

ASIGNACION:
    LISTARECURSIVA 'igual' COND
        {
            $$ = new Asignacion ("ASIGNACION", "ASIGNACION", @1, [$1, $3]);
        }
    | INCREMENTOS
        {
            $$ = $1;
        };

INCREMENTOS:
    LISTARECURSIVA 'masmas'
        {
            $$ = new Asignacion ("ASIGNACION", "ASIGNACION", @1, [
                $1, 
                new Expresion ("MAS", "+", @1, [$1, new Expresion ("NUMERICO", "1", @1, [] )])
            ]);
        }
    | LISTARECURSIVA 'menosmenos'
        {
            $$ = new Asignacion ("ASIGNACION", "ASIGNACION", @1, [
                $1, 
                new Expresion ("MENOS", "-", @1, [$1, new Expresion ("NUMERICO", "1", @1, [] )])
            ]);
        };

///////////////////////////////////////////////LLAMADA RECURSIVA////////////////////////////////////////

LISTARECURSIVA:
    LISTARECURSIVA  ELEMENTRECURSIVO
        {
            $1.hijos = $1.hijos.concat($2);
            $$ = $1;
        }
    | ID
        {
            $$ = new Recursivo ("LLAMADARECURSIVA", "LLAMADARECURSIVA", @1, [$1]);
        }
    | ID LISTAACCESODIMS
        {
            $$ = new Recursivo ("LLAMADARECURSIVA", "LLAMADARECURSIVA", @1, [$1, $2]);
        };

ELEMENTRECURSIVO:
    'punto' ID
        {   
            $$ = [$2];
        }
    | 'punto' ID LISTAACCESODIMS
        {
            $$ = [$2, $3];
        }
    | 'punto' 'length'
        {
            $$ = [new NodoMM("LENGTH", "LENGTH", @1, [])];
        }
    | 'punto' 'pop' 'parentesisabre' 'parentesiscierra'
        {
            $$ = [new NodoMM("POP", "POP", @1, [])];
        }
    | 'punto' 'push' 'parentesisabre' COND 'parentesiscierra'
        {
            $$ = [new NodoMM("PUSH", "PUSH", @1, [$4])];
        }
    | 'punto' 'toLowerCase' 'parentesisabre' 'parentesiscierra'
        {
            $$ = [new NodoMM("TOLOWER", "TOLOWER", @1, [$4])];
        }
    | 'punto' 'toUpperCase' 'parentesisabre' 'parentesiscierra'
        {
            $$ = [new NodoMM("TOUPPER", "TOUPPER", @1, [$4])];
        };

LISTAACCESODIMS:
    LISTAACCESODIMS 'corcheteabre' COND 'corchetecierra'
        {
            $1.hijos.push($3);
            $$ = $1;
        }
    | 'corcheteabre' COND 'corchetecierra'
        {
            $$ = new NodoMM ("LISTAACCESODIMS", "LISTAACCESODIMS",@2,[$2]);
        };




//////////////////////////////////////////////IMPRESIONES/////////////////////////////////////////////////

IMPRIMIR:
    'console' 'punto' 'log' 'parentesisabre' LISTAEXP 'parentesiscierra' 'puntoycoma'
        {
            $$ = new Imprimir ("imprimir","PRINT",@1, [$5]);
        };

IMPRIMIR:
    'graficar_ts' 'parentesisabre' 'parentesiscierra' 'puntoycoma'
        {
            $$ = new GraficarTS ("imprimir","PRINT",@1, []);
        };

///////////////////////////////////////////EXPRESIONES//////////////////////////////////////////////////////

COND: 
    COND 'and' COND
        {
            $$ = new Condicional ("AND", "&&", @1, [$1, $3]);
        }
    | COND 'or' COND
        {
            $$ = new Condicional ("OR", "||", @1, [$1, $3]);
        }
    | 'not' COND
        {
            $$ = new Condicional ("NOT", "!", @1, [$2]);
        }
    | REL
        {
            $$ = $1;
        }
    | TERNARIO
        {
            $$ = $1;
        };

REL:
    EXP 'mayor' EXP 
        {
            $$ = new Relacional ("MAYOR", ">", @1, [$1, $3]);
        }
    | EXP 'menor' EXP 
        {
            $$ = new Relacional ("MENOR", "<", @1, [$1, $3]);
        }
    | EXP 'menoroigual' EXP
        {
            $$ = new Relacional ("MENOROIGUAL", "<=", @1, [$1, $3]);
        }
    | EXP 'mayoroigual' EXP
        {
            $$ = new Relacional ("MAYOROIGUAL", ">=", @1, [$1, $3]);
        }
    | EXP 'igualigual' EXP
        {
            $$ = new Relacional ("IGUALIGUAL", "==", @1, [$1, $3]);
        }
    | EXP 'diferente' EXP
        {
            $$ = new Relacional ("DIFERENTE", "!=", @1, [$1, $3]);
        }
    | EXP
        {
            $$ = $1;
        };

EXP:
    EXP '+' EXP
        {
            $$ = new Expresion ("MAS", "+", @1, [$1,$3] );
        }
    | EXP '-' EXP
        {
            $$ = new Expresion ("MENOS", "-", @1, [$1,$3] );
        }
    | EXP '*' EXP
        {
            $$ = new Expresion ("POR", "*", @1, [$1,$3] );
        }
    | EXP 'potencia' EXP
        {
            $$ = new Expresion ("POTENCIA", "**", @1, [$1,$3] );
        }
    | EXP '/' EXP
        {
            $$ = new Expresion ("DIV", "/", @1, [$1,$3] );
        }
    | EXP '%' EXP
        {
            $$ = new Expresion ("MODULO", "%", @1, [$1,$3] );
        }
    | ENTERO
        {
            $$ = new Expresion ("NUMERICOE", yytext, @1, [] );
        }
    | DECIMAL
        {
            $$ = new Expresion ("NUMERICO", yytext, @1, [] );
        }
    | '-' EXP %prec UMINUS
        {
            $$ = new Expresion ("NEGADO", "-", @1, [$2] );
        }
    | CADENA
        {
            $$ = new Expresion ("STRING", ((yytext.split("\\\"").join("\"")).split("\\t").join("\t")).split("\\n").join("\n").split("\\\\").join("\\").split("\\r").join("\r"), @1, [] );
        }
    | 'verdadero'
        {
            $$ = new Expresion ("BOOLEAN", "true", @1, [] );
        }
    | 'falso'
        {
            $$ = new Expresion ("BOOLEAN", "false", @1, [] );
        }
    | 'null'
        {
            $$ = new Expresion ("NULL", "null", @1, [] );
        }
    | 'undefined'
        {
            $$ = new Expresion ("UNDEFINED", "undefined", @1, [] );
        }
    | 'parentesisabre' COND 'parentesiscierra'
        {
            $2.parentesis = true;
            $$ = $2;
        }
    | LISTARECURSIVA
        {
            $$ = $1;
        }
    | EXPARRAY
        {
            $$ = $1;
        }
    | EXPARRAYNEW
        {
            $$ = $1;
        }
    | EXPOBJ
        {
            $$ = $1;
        }
    | INCREMENTOS
        {
            $$ = $1;
        }
    | LLAMADAFUNCION
        {
            $$ = $1;
        };

EXPARRAYNEW:
    'new' 'Array' 'parentesisabre' COND 'parentesiscierra'
        {
            $$ = new ExpArrayNew ("EXPARRAYNEW", "EXPARRAYNEW", @2, [$4]);
        };

EXPARRAY:
    'corcheteabre' LISTAEXP 'corchetecierra'
        {
            $$ = new ExpArray ("EXPARRAY", "EXPARRAY", @2, [$2]);
        }
    | 'corcheteabre' 'corchetecierra'
        {
            $$ = new ExpArray ("EXPARRAY", "EXPARRAY", @2, []);
        };

LISTAEXP:
    LISTAEXP 'coma' COND
        {
            $1.hijos.push($3);
            $$ = $1;
        }
    | COND
        {
            $$ = new NodoMM ("LISTAEXP", "LISTAEXP", @1, [$1]);
        };

ID:
    'IDENTIFICADOR'
        {
            $$ = new NodoMM ("ID", yytext, @1, [] );
        };



%%


parser.treeparser  = {
 raiz : null
};

 parser.error ={
  error:[]

};
