// deno-lint-ignore-file no-explicit-any
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.ts";
import { tokenize , Token, TokenType} from "./lexer.ts";

//declare a class with methods
export default class Parser{
    //returns a token?
    private tokens: Token[] = [];


    private not_eof(): boolean{
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(){
        return this.tokens[0] as Token;
    }

    private eat(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect (type: TokenType, err: any){
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type){
            console.error("Parser Error: \n", err, prev, "Expecting: ", type);
            Deno.exit(1);
        }
        return prev;
    }
    // eto yung iccall sa main
    //returns a program
    /*a program is
    kind: "Program"
    body: Stmt[]
    Stmt is 
    kind: NodeType
    */
    public produceAST (sourceCode:string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program ={
        kind: "Program",
        body: [],
        };
        while(this.not_eof()){
            program.body.push(this.parse_stmt());
        }

    return program;
    }

    private parse_stmt(): Stmt{
        //skip to parse_expr
        return this.parse_expr();
    }
    private parse_expr(): Expr{
        return this.parse_additive_expr();
    }
    
    private parse_additive_expr(): Expr{
        let left = this.parse_multiplicative_expr();
        
        while(this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left, 
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr{
        let left = this.parse_primary_expr();
        
        while(this.at().value == "*" || this.at().value == "/"|| this.at().value == "%"){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left, 
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }


    private parse_primary_expr(): Expr{
        const tk = this.at().type;

        switch (tk){

            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value), } as NumericLiteral;
            case TokenType.Null:
                this.eat();
                return { kind: "NullLiteral", value: "null"} as NullLiteral;
            case TokenType.OpenParen: {
                this.eat(); //eat opening paren
                const value = this.parse_expr();
                //so after gawin lahat ng nasa loop, eat the current character
                //if it's not a closing parenthesis, show the error
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected token found inside parentheisised expression. Expected closing parenthesis.",
                ); //eat closing paren
                return value;
            }
            

            default:
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
            
        }
    }
}

 // Orders of Precedence
    //AssignmentExpr
    //MemberExpr
    //FunctionCall
    //LogicalExpr
    //Comparison
    //additiveExpr
    //MultiExpr
    //UnaryExpr
    //primary expression
/* 
case TokenType.Number:
            case TokenType.Equals:
            case TokenType.OpenParen:
            case TokenType.CloseParen:
            case TokenType.BinaryOperator:
            case TokenType.Let:
            case TokenType.Outer:
            case TokenType.EOF:
*/