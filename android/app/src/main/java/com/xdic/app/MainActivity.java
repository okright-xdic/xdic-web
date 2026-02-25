package com.xdic.app;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ✅ [핵심 특권] 화면이 켜져 있는 동안은 안드로이드가 절대 앱과 마이크를 잠재우지 못하게 강제 방어!
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}