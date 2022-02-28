TARGET=emscripten_scetool.mjs
EXPORT_FUNCTIONS=_decrypt_self,_encrypt_elf
CC=em++
CFLAGS=-O2 -s -Wall
LDFLAGS=-s USE_ZLIB=1 -s INVOKE_RUN=0 -s TOTAL_MEMORY=50MB -s ENVIRONMENT=web -s MODULARIZE=1 -s STRICT_JS=1 -s EXPORTED_RUNTIME_METHODS=ccall,cwrap,FS -s EXPORTED_FUNCTIONS=$(EXPORT_FUNCTIONS) --embed-file data --embed-file klics --embed-file raps --embed-file rifs -lz
SRC=src
OBJ=obj
OBJECTS=$(patsubst $(SRC)/%.c,$(OBJ)/%.o,$(wildcard $(SRC)/*.c)) $(patsubst $(SRC)/%.cpp,$(OBJ)/%.o,$(wildcard $(SRC)/*.cpp))

.PHONY: clean

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS) $(LIBS)

$(OBJ)/%.o: src/%.c
	$(CC) $(CFLAGS) $(CFLAGS) -std=c99 -c -o $@ $<

obj/%.o: src/%.cpp
	$(CC) $(CFLAGS) $(CFLAGS) -std=c++11 -c -o $@ $<

clean:
	rm -f $(OBJ)/*
	rm -f $(TARGET)
	rm -f *.wasm