import sys


class poup_lang:
    def __init__(self):
        self.data = [0]*256

    def toNumber(self, code):
        return eval('*'.join(list(map(lambda cmd:str((self.data[cmd.count('ㅋ')-1] if cmd.count('ㅋ') else 0) + cmd.count('.') - cmd.count(',')), code.split(' ')))))

    @staticmethod
    def type(code):
        if 'ㅋㅋ' in code:
            return 'IF'
        if '푸웁' in code:
            return 'MOVE'
        if '팝' in code:
            return 'END'
        if 'ㅋ' in code and '?' in code:
            return 'INPUT'
        if 'ㅋ' in code and '!' in code:
            return 'PRINT'
        if '캌' in code and 'ㅋ' in code:
            return 'PRINTASCII'
        if '풉' in code:
            return 'DEF'

    def compileLine(self, code):
        if code == '':
            return None
        TYPE = self.type(code)
        
        if TYPE == 'DEF':
            var, cmd = code.split('풉')
            self.data[var.count('ㅋ')] = self.toNumber(cmd)
        elif TYPE == 'END':
            print(self.toNumber(code.split('팝')[1]), end='')
            sys.exit()
        elif TYPE == 'INPUT':
            self.data[code.replace('ㅋ?', '').count('ㅋ')] = int(input())
        elif TYPE == 'PRINT':
            print(self.toNumber(code[1:-1]), end='')
        elif TYPE == 'PRINTASCII':
            value = self.toNumber(code[1:-1])
            print(chr(value) if value else '\n', end='')
        elif TYPE == 'IF':
            cond, cmd = code.replace('ㅋㅋ', '').split('?')
            if self.toNumber(cond) == 0:
                return cmd
        elif TYPE == 'MOVE':
            return self.toNumber(code.replace('푸웁', ''))

    def compile(self, code, check=True, errors=100000):
        jun = False
        recode = ''
        spliter = '\n' if '\n' in code else '~'
        code = code.rstrip().split(spliter)
        if check and (code[0].replace(" ","") != '풉ㅋ' or code[-1] != '팝ㅋ' or not code[0].startswith('풉ㅋ')):
            raise SyntaxError('이게 풉언어라고? ㅋㅋ')
        index = 0
        error = 0
        while index < len(code):
            errorline = index
            c = code[index].strip()
            res = self.compileLine(c)
            if jun:
                jun = False
                code[index] = recode                
            if isinstance(res, int):
                index = res-2
            if isinstance(res, str):
                recode = code[index]
                code[index] = res
                index -= 1
                jun = True

            index += 1
            error += 1
            if error == errors:
                raise RecursionError(str(errorline+1) + '번째 줄에서 무한코드 감지.')

    def compilePath(self, path):
        with open(path) as file:
            code = ''.join(file.readlines())
            self.compile(code)