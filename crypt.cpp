#include <stdio.h>
#include <string.h>

/* Initial permutation */
const int IP[] = {
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17,  9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
};

/* Final permutation */
const int FP[] = {
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41,  9, 49, 17, 57, 25
};

/* Permuted-choice 1 from the key bits to yield C and D */
const int PC1_C[] = {
    57, 49, 41, 33, 25, 17,  9,
    1, 58, 50, 42, 34, 26, 18,
    10,  2, 59, 51, 43, 35, 27,
    19, 11,  3, 60, 52, 44, 36
};

const int PC1_D[] = {
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14,  6, 61, 53, 45, 37, 29,
    21, 13,  5, 28, 20, 12,  4
};

/* Sequence of shifts used for the key schedule */
const int shifts[] = {1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1};

/* Permuted-choice 2 */
const int PC2_C[] = {
    14, 17, 11, 24,  1,  5,
    3, 28, 15,  6, 21, 10,
    23, 19, 12,  4, 26,  8,
    16,  7, 27, 20, 13,  2
};

const int PC2_D[] = {
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
};



/* P permutation table */
const int P[] = {
    16,  7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2,  8, 24, 14,
    32, 27,  3,  9,
    19, 13, 30,  6,
    22, 11,  4, 25
};

/* The 8 selection functions */
const int S[8][64] = {
    {
        14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
        0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
        4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
        15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13
    },
    {
        15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
        3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
        0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
        13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9
    },
    {
        10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
        13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
        13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
        1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12
    },
    {
        7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
        13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
        10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
        3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14
    },
    {
        2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
        14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
        4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
        11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3
    },
    {
        12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
        10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
        9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
        4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13
    },
    {
        4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
        13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
        1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
        6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12
    },
    {
        13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
        1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
        7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
        2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11
    }
};

// /* C and D arrays for key schedule */
// int C[28];
// int D[28];

// /* Key schedule */
// int KS[16][48];

/* Function declarations */
void setkey(const char *key);
void encrypt(char *block);
void crypt(const char *pw, const char *salt, char *result);

void setkey(const char *key,int KS[16][48]) {
    /* C and D arrays for key schedule */
    int C[28]={0};
    int D[28]={0};
    for (int i = 0; i < 28; i++) {
        C[i] = key[PC1_C[i] - 1];
        D[i] = key[PC1_D[i] - 1];
    }

    for (int i = 0; i < 16; i++) {
        for (int k = 0; k < shifts[i]; k++) {
            int temp = C[0];
            for (int j = 0; j < 28 - 1; j++) {
                C[j] = C[j + 1];
            }
            C[27] = temp;
            temp = D[0];
            for (int j = 0; j < 28 - 1; j++) {
                D[j] = D[j + 1];
            }
            D[27] = temp;
        }

        for (int j = 0; j < 24; j++) {
            KS[i][j] = C[PC2_C[j] - 1];
            KS[i][j + 24] = D[PC2_D[j] - 28 - 1];
        }
    }
}

void encrypt(char *block,int KS[16][48],int E[48]) {
    int left[32], right[32], old[32], f[32], preS[48];

    for (int j = 0; j < 32; j++) {
        left[j] = block[IP[j] - 1];
    }
    for (int j = 32; j < 64; j++) {
        right[j - 32] = block[IP[j] - 1];
    }

    for (int ii = 0; ii < 16; ii++) {
        int i = ii;
        for (int j = 0; j < 32; j++) {
            old[j] = right[j];
        }
        for (int j = 0; j < 48; j++) {
            preS[j] = right[E[j] - 1] ^ KS[i][j];
        }
        for (int j = 0; j < 8; j++) {
            int temp = 6 * j;
            int k =
                S[j][(preS[temp + 0] << 5) +
                     (preS[temp + 1] << 3) +
                     (preS[temp + 2] << 2) +
                     (preS[temp + 3] << 1) +
                     (preS[temp + 4]) +
                     (preS[temp + 5] << 4)];
            temp = 4 * j;
            f[temp + 0] = (k >> 3) & 1;
            f[temp + 1] = (k >> 2) & 1;
            f[temp + 2] = (k >> 1) & 1;
            f[temp + 3] = k & 1;
        }
        for (int j = 0; j < 32; j++) {
            right[j] = left[j] ^ f[P[j] - 1];
        }
        for (int j = 0; j < 32; j++) {
            left[j] = old[j];
        }
    }

    for (int j = 0; j < 32; j++) {
        int temp = left[j];
        left[j] = right[j];
        right[j] = temp;
    }

    for (int j = 0; j < 64; j++) {
        int i = FP[j];
        block[j] = (i < 33) ? left[FP[j] - 1] : right[FP[j] - 33];
    }
}

void crypt(const char *pw, const char *salt, char *result) {

    if (strlen(salt) != 2) {
        fprintf(stderr, "Length of salt must be 2\n");
        return;
    }

    char block[66] = {0};
    char iobuf[16] = {0};
    int c = 0;

    for (int i = 0; c < strlen(pw) && (i < 64); i++) {
        for (int j = 0; j < 7; j++, i++) {
            block[i] = (pw[c] >> (6 - j)) & 1;
        }
        ++c;
    }
    /* Key schedule */
    int KS[16][48]={0};
    setkey(block,KS);
    /* E bit-selection table */
    int E[48] = {
        32,  1,  2,  3,  4,  5,
        4,  5,  6,  7,  8,  9,
        8,  9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32,  1
    };

    for (int i = 0; i < 66; i++) {
        block[i] = 0;
    }

    c = 0;
    for (int i = 0; i < 2; i++) {
        iobuf[i] = salt[c];
        int k = salt[c];
        c++;

        if (k > 'Z') {
            k -= 6;
        }

        if (k > '9') {
            k -= 7;
        }

        k -= '.';

        for (int j = 0; j < 6; j++) {
            if ((k >> j) & 1) {
                int temp = E[6 * i + j];
                E[6 * i + j] = E[6 * i + j + 24];
                E[6 * i + j + 24] = temp;
            }
        }
    }

    for (int i = 0; i < 25; i++) {
        encrypt(block,KS,E);
    }

    for (int i = 0; i < 11; i++) {
        int c = 0;
        for (int j = 0; j < 6; j++) {
            c <<= 1;
            c |= block[6 * i + j];
        }

        c += '.';
        if (c > '9') {
            c += 7;
        }

        if (c > 'Z') {
            c += 6;
        }

        iobuf[i + 2] = c;
    }

    iobuf[13] = 0;

    if (iobuf[1] == 0) {
        iobuf[1] = iobuf[0];
    }

    strcpy(result, iobuf);
}

void trip_generate(const char *trip_key,char *result){
    char salt[3];
    strncpy(salt, trip_key + 1, 2); // tripkeyの2,3文字目を取得
    salt[2] = '\0'; // 文字列終端を追加

    // 文字列を変換
    for (int i = 0; i < 2; ++i) {
        if (salt[i] < '.' || salt[i] > 'z') // '.' から 'z' の間でない場合、'.' に置き換える
            salt[i] = '.';
    }

    for (int i = 0; i < 2; ++i) {
        char c = salt[i];
        if (c >= ':' && c <= '`') { // ':' から '`' の間であれば変換
            if (c <= '>')
                salt[i] = c - ':';
            else if (c <= 'Z')
                salt[i] = c - ';' + 'A';
            else if (c <= 'z')
                salt[i] = c - '<' + 'a';
        }
    }
    crypt(trip_key, salt, result);
}
int main() {
    char result[16];
    const char *tripkey = "とりっぷ";  // トリップキー文字列（# 付き）
    char salt[3];
    strncpy(salt, tripkey + 1, 2); // tripkeyの2,3文字目を取得
    salt[2] = '\0'; // 文字列終端を追加

    // 文字列を変換
    for (int i = 0; i < 2; ++i) {
        if (salt[i] < '.' || salt[i] > 'z') // '.' から 'z' の間でない場合、'.' に置き換える
            salt[i] = '.';
    }

    for (int i = 0; i < 2; ++i) {
        char c = salt[i];
        if (c >= ':' && c <= '`') { // ':' から '`' の間であれば変換
            if (c <= '>')
                salt[i] = c - ':';
            else if (c <= 'Z')
                salt[i] = c - ';' + 'A';
            else if (c <= 'z')
                salt[i] = c - '<' + 'a';
        }
    }

    // crypt(password, salt, result);
    crypt(tripkey, salt, result);
    printf("TripKey: %s\n", tripkey);
    printf("Salt: %s\n", salt);
    printf("Trip: %s\n", result);

    return 0;

}

