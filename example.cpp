#include <emscripten/emscripten.h>
#include <string>

extern "C" {
   EMSCRIPTEN_KEEPALIVE
   const char* addMr(const char* name) {
      std::string result = "Mr. " + std::string(name);
      char* cstr = new char[result.length() + 1];
      std::strcpy(cstr, result.c_str());
      return cstr;
   }
}
